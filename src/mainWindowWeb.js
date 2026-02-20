const { Viewer } = require("./viewer/viewer.js")
const { ModelBuilder } = require("./util/modelBuilder.js")
const { KmpData } = require("./util/kmpData.js")
const { KclLoader, collisionTypeData } = require("./util/kclLoader.js")


let gMainWindow = null
const APP_VERSION = (typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "web")


function main()
{
	gMainWindow = new MainWindow()	
}


function isMacPlatform()
{
	return /Mac|iPhone|iPad|iPod/i.test(window.navigator.platform)
}


function normalizeFilename(str)
{
	if (str == null)
		return null

	return str.replace(new RegExp("\\\\", "g"), "/")
}


function getExtension(filename)
{
	if (filename == null)
		return ""

	const i = filename.lastIndexOf(".")
	if (i < 0)
		return ""
	return filename.substring(i).toLowerCase()
}


class MainWindow
{
	constructor()
	{
		this.currentKmpFileHandle = null
		this.currentDirectoryHandle = null
		this.currentKclFileHandle = null
		this.currentKclBytes = null
		this.currentModelFileHandle = null

		document.body.onresize = () => this.onResize()
		window.addEventListener("beforeunload", (ev) => this.onClose(ev))
		this.bindToolbar()
		
		// To prevent strange bug with the browser undoing/redoing changes in destroyed input elements
		document.body.onkeydown = (ev) =>
		{
			const isMod = (ev.ctrlKey || ev.metaKey)
			const key = ev.key.toLowerCase()

			if (!isMod)
				return

			if (key === "z")
			{
				ev.preventDefault()
				ev.stopPropagation()
				if (ev.shiftKey)
					this.redo()
				else
					this.undo()
				return
			}

			if (key === "y")
			{
				ev.preventDefault()
				ev.stopPropagation()
				this.redo()
				return
			}

			if (key === "n")
			{
				ev.preventDefault()
				ev.stopPropagation()
				void this.newKmp()
				return
			}

			if (key === "o")
			{
				ev.preventDefault()
				ev.stopPropagation()
				void this.askOpenKmp()
				return
			}

			if (key === "s")
			{
				ev.preventDefault()
				ev.stopPropagation()
				if (ev.shiftKey)
					void this.saveKmpAs()
				else
					void this.saveKmp(this.currentKmpFilename)
			}
		}
		
		this.noModelLoaded = true
		
		this.cfg =
		{
			isBattleTrack: false,
			useOrthoProjection: false,
			cameraMovementSpeed: 0.5,
			pointScale: 1,
			shadingFactor: 0.3,
			fogFactor: 0.0000025,

			kclEnableModel: true,
			kclEnableColors: true,
			kclEnableWalls: true,
			kclEnableDeathBarriers: true,
			kclEnableInvisible: true,
			kclEnableItemRoad: false,
			kclEnableEffects: false,
			kclHighlighter: 0,
			kclTriIndex: [-1, -1],

			enableRotationRender: true,

			startPointsEnableZoneRender: true,

			enemyPathsEnableSizeRender: true,

			checkpointsEnableVerticalPanels: true,
			checkpointsEnableRespawnPointLinks: true,
			checkpointsEnableDirectionArrows: true,

			respawnsEnablePlayerSlots: true,

			objectsEnableSignedSettings: false,

			cannonsEnableDirectionRender: false,
			cannonsEnableKclHighlight: true,

			snapToCollision: true,
			lockAxisX: false,
			lockAxisY: false,
			lockAxisZ: false,
			unlockAxes() 
			{
				this.lockAxisX = false
				this.lockAxisY = false
				this.lockAxisZ = false
			}
		}

		this.hl = 
		{
			baseType: -1,
			basicEffect: -1,
			blightEffect: -1,
			intensity: -1,
			collisionEffect: -1
		}
		this.hl.reset = () =>
		{
			this.hl.baseType = -1,
			this.hl.basicEffect = -1,
			this.hl.blightEffect = -1,
			this.hl.intensity = -1,
			this.hl.collisionEffect = -1
		}

		
		this.currentKmpFilename = null
		this.currentKclFilename = null
		this.currentKmpData = new KmpData()
		this.currentNotSaved = false
		
		this.undoNeedsNewSlot = false
		this.undoStack = []
		this.undoPointer = -1
		this.savedUndoSlot = -1
		
		this.panels = []

		this.refreshTitle()
		this.setupCameraSpeedControl()

		this.sidePanelDiv = document.getElementById("divSidePanel")
		this.viewer = new Viewer(this, document.getElementById("canvasMain"), this.cfg, this.currentKmpData)
		this.refreshPanels()
		
		void this.newKmp(false)
	}


	onResize()
	{
		this.viewer.resize()
		this.viewer.render()
	}
	
	
	onReload()
	{
		window.location.reload()
	}
	
	
	onClose(ev)
	{
		if (!this.currentNotSaved)
			return

		ev.preventDefault()
		ev.returnValue = ""
	}


	openExternalLink(link)
	{
		window.open(link, "_blank", "noopener,noreferrer")
	}


	setupCameraSpeedControl()
	{
		let input = document.getElementById("inputCameraSpeed")
		if (input == null)
			return

		let applySpeed = (valueRaw) =>
		{
			let value = parseFloat(valueRaw)
			if (isNaN(value) || !isFinite(value))
				value = this.cfg.cameraMovementSpeed

			value = Math.max(0.1, Math.min(10, value))
			this.cfg.cameraMovementSpeed = value
			input.value = value.toFixed(2).replace(/\.?0+$/, "")
		}

		input.value = this.cfg.cameraMovementSpeed.toFixed(2).replace(/\.?0+$/, "")
		input.onchange = () => applySpeed(input.value)
		input.onblur = () => applySpeed(input.value)
	}


	bindToolbar()
	{
		const byId = (id) => document.getElementById(id)
		const bind = (id, fn) =>
		{
			const button = byId(id)
			if (button != null)
				button.onclick = () => { void fn() }
		}

		bind("btnNewKmp", () => this.newKmp())
		bind("btnOpenKmp", () => this.askOpenKmp())
		bind("btnOpenTrackFolder", () => this.askOpenTrackFolder())
		bind("btnSaveKmp", () => this.saveKmp(this.currentKmpFilename))
		bind("btnSaveKmpAs", () => this.saveKmpAs())
		bind("btnOpenModel", () => this.openCustomModel())
		bind("btnUndo", () => { this.undo(); return Promise.resolve() })
		bind("btnRedo", () => { this.redo(); return Promise.resolve() })
	}


	async pickSingleFileFromInput(accept, directory = false)
	{
		return await new Promise((resolve) =>
		{
			const input = document.createElement("input")
			input.type = "file"
			input.style.display = "none"
			input.accept = accept
			if (directory)
			{
				input.setAttribute("webkitdirectory", "")
				input.setAttribute("directory", "")
			}

			input.onchange = () =>
			{
				const files = input.files
				if (directory)
					resolve(files)
				else if (files != null && files.length > 0)
					resolve(files[0])
				else
					resolve(null)
				input.remove()
			}

			document.body.appendChild(input)
			input.click()
		})
	}


	async pickFileHandle(options)
	{
		if (window.showOpenFilePicker == null)
			return null

		try
		{
			const handles = await window.showOpenFilePicker(options)
			if (handles != null && handles.length > 0)
				return handles[0]
		}
		catch (e)
		{
			if (e.name !== "AbortError")
				console.error(e)
		}
		return null
	}


	async pickDirectoryHandle()
	{
		if (window.showDirectoryPicker == null)
			return null

		try
		{
			return await window.showDirectoryPicker()
		}
		catch (e)
		{
			if (e.name !== "AbortError")
				console.error(e)
		}
		return null
	}


	async readHandleBytes(fileHandle)
	{
		const file = await fileHandle.getFile()
		return new Uint8Array(await file.arrayBuffer())
	}


	async readFileBytesFromDirectory(directoryHandle, filename)
	{
		try
		{
			const fileHandle = await directoryHandle.getFileHandle(filename)
			return {
				filename,
				fileHandle,
				bytes: await this.readHandleBytes(fileHandle)
			}
		}
		catch (e)
		{
			return null
		}
	}


	buildKmpFileTypeFilter()
	{
		return {
			description: "KMP Files (*.kmp)",
			accept: { "application/octet-stream": [".kmp"] }
		}
	}


	buildModelFileTypeFilter()
	{
		return {
			description: "Supported model formats (*.obj, *.brres, *.kcl)",
			accept: { "application/octet-stream": [".obj", ".brres", ".kcl"] }
		}
	}


	getKmpDownloadName()
	{
		return (this.currentKmpFilename == null ? "course.kmp" : this.currentKmpFilename)
	}


	downloadBytes(bytes, filename)
	{
		const blob = new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = filename
		a.style.display = "none"
		document.body.appendChild(a)
		a.click()
		a.remove()
		URL.revokeObjectURL(url)
	}
	
	
	refreshPanels()
	{
		let panel = this.addPanel("Model")
		panel.addText(null, "<strong>Hold Right Mouse:</strong> Look Around")
		panel.addText(null, "<strong>Hold Right Mouse + WASDQE:</strong> Move Camera")
		panel.addText(null, "<strong>Middle Mouse:</strong> Rotate Camera")
		panel.addText(null, "<strong>Hold Shift + Middle Mouse:</strong> Pan Camera")
		panel.addText(null, "<strong>Mouse Wheel:</strong> Zoom")
		panel.addText(null, "<strong>Double Right Click:</strong> Focus Camera")
		panel.addSpacer(null)
		//panel.addButton(null, "Load course_model.brres", () => this.openCourseBrres())
		//panel.addButton(null, "Load course.kcl", () => this.openCourseKcl())
		panel.addButton(null, "Load KMP", () => this.askOpenKmp())
		panel.addButton(null, "Load Track Folder", () => this.askOpenTrackFolder())
		panel.addButton(null, "Load Model", () => this.openCustomModel())
		panel.addButton(null, "(5) Toggle Projection", () => this.cfg.useOrthoProjection = !this.cfg.useOrthoProjection)
		panel.addButton(null, "Center view", () => this.viewer.centerView())
		panel.addSlider(null, "Shading", 0, 1, this.cfg.shadingFactor, 0.05, (x) => this.cfg.shadingFactor = x)
		panel.addSlider(null, "Fog", 0.0000001, 0.0002, this.cfg.fogFactor, 0.0000001, (x) => this.cfg.fogFactor = x)
		panel.addSlider(null, "Point Scale", 0.1, 5, this.cfg.pointScale, 0.1, (x) => this.cfg.pointScale = x)
		panel.addSpacer(null)
		
		let kclGroup = panel.addGroup(null, "Collision data:")
		//panel.addCheckbox(kclGroup, "Enable model", this.cfg.kclEnableModel, (x) => { this.cfg.kclEnableModel = x; this.openKcl(this.currentKclFilename) })
		panel.addCheckbox(kclGroup, "Use colors", this.cfg.kclEnableColors, (x) => { this.cfg.kclEnableColors = x; this.reloadCurrentKcl() })
		panel.addCheckbox(kclGroup, "Show walls", this.cfg.kclEnableWalls, (x) => { this.cfg.kclEnableWalls = x; this.reloadCurrentKcl() })
		panel.addCheckbox(kclGroup, "Show death barriers", this.cfg.kclEnableDeathBarriers, (x) => { this.cfg.kclEnableDeathBarriers = x; this.reloadCurrentKcl() })
		panel.addCheckbox(kclGroup, "Show invisible walls", this.cfg.kclEnableInvisible, (x) => { this.cfg.kclEnableInvisible = x; this.reloadCurrentKcl() })
		panel.addCheckbox(kclGroup, "Show item road/wall", this.cfg.kclEnableItemRoad, (x) => { this.cfg.kclEnableItemRoad = x; this.reloadCurrentKcl() })
		panel.addCheckbox(kclGroup, "Show effects/triggers", this.cfg.kclEnableEffects, (x) => { this.cfg.kclEnableEffects = x; this.reloadCurrentKcl() })
		panel.addSpacer(kclGroup)

		let hlOptions =
		[
			{ str: "None", value: 0 },
			{ str: "Trickable Road", value: 1 },
			{ str: "Horizontal Walls", value: 2 },
			{ str: "Barrel Roll Walls", value: 3 },
			{ str: "Custom Flag", value: 4 },
			{ str: "Triangle Index", value: 5 },
			{ str: "Sloped Walls", value: 6 },
		]
		panel.addSelectionDropdown(kclGroup, "Highlight", this.cfg.kclHighlighter, hlOptions, true, false, (x) => { this.cfg.kclHighlighter = x; this.refreshPanels() })
	
		const onBlur = (x) =>
		{
			this.reloadCurrentKcl()
			this.viewer.render()
			return x
		}
		
		if (this.cfg.kclHighlighter === 4)
		{	
			let flagOptions = [{ str: "None", value: -1 }]
			for (let i = 0; i <= 0x1f; i++)
				flagOptions.push({ str: "(0x" + i.toString(16) + ") " + collisionTypeData[i].name, value: i })

			panel.addSelectionDropdown(kclGroup, "Base Type", this.hl.baseType, flagOptions, true, false, (x, i) => { this.hl.baseType = x; onBlur(null) })
			
			panel.addSelectionNumericInput(kclGroup, "Variant", 	 	 -1, 0x7,  this.hl.basicEffect, 	1.0, 0.0, true, false, (x) => { this.hl.basicEffect = x 	}, onBlur)
			panel.addSelectionNumericInput(kclGroup, "BLIGHT Index", 	 -1, 0x7,  this.hl.blightEffect, 	1.0, 0.0, true, false, (x) => { this.hl.blightEffect = x 	}, onBlur)
			panel.addSelectionNumericInput(kclGroup, "Wheel Depth", 	 -1, 0x3,  this.hl.intensity, 		1.0, 0.0, true, false, (x) => { this.hl.intensity = x	 	}, onBlur)
			panel.addSelectionNumericInput(kclGroup, "Collision Effect", -1, 0x7,  this.hl.collisionEffect, 1.0, 0.0, true, false, (x) => { this.hl.collisionEffect = x }, onBlur)
		}
		else if (this.cfg.kclHighlighter === 5)
		{
			panel.addSelectionNumericInput(kclGroup, "Tri Index Min", -1, 0xffff,  this.cfg.kclTriIndex[0], 1.0, 1.0, true, false, (x) => { this.cfg.kclTriIndex[0] = x }, onBlur)
			panel.addSelectionNumericInput(kclGroup, "Tri Index Max", -1, 0xffff,  this.cfg.kclTriIndex[1], 1.0, 1.0, true, false, (x) => { this.cfg.kclTriIndex[1] = x }, onBlur)
		}
		else
		{
			this.hl.reset()
			this.reloadCurrentKcl()
		}
		panel.addSpacer(null)

		let moveGroup = panel.addGroup(null, "Movement:")
		panel.addCheckbox(moveGroup, "Snap to collision", this.cfg.snapToCollision, (x) => { this.cfg.snapToCollision = x; if (x) this.cfg.unlockAxes(); this.refreshPanels() })
		panel.addCheckbox(moveGroup, "Lock X axis", this.cfg.lockAxisX, (x) => { this.cfg.lockAxisX = x; if (x) this.cfg.snapToCollision = false; this.refreshPanels() })
		panel.addCheckbox(moveGroup, "Lock Y axis", this.cfg.lockAxisY, (x) => { this.cfg.lockAxisY = x; if (x) this.cfg.snapToCollision = false; this.refreshPanels() })
		panel.addCheckbox(moveGroup, "Lock Z axis", this.cfg.lockAxisZ, (x) => { this.cfg.lockAxisZ = x; if (x) this.cfg.snapToCollision = false; this.refreshPanels() })
		
		this.refreshTitle()
		this.viewer.refreshPanels()
	}
	
	
	refreshTitle()
	{
		const title =
			(this.currentKmpFilename == null ? "[New File]" : "[" + this.currentKmpFilename + "]") +
			(this.currentNotSaved ? "*" : "") +
			" -- Lorenzi's KMP Editor v" + APP_VERSION

		document.title = title

		const status = document.getElementById("lblFileStatus")
		if (status != null)
			status.textContent = (this.currentKmpFilename == null ? "New File" : this.currentKmpFilename) + (this.currentNotSaved ? " *" : "")
	}
	
	
	addPanel(name, open = true, onToggle = null, closable = false)
	{
		let panel = this.panels.find(p => p.name == name)
		if (panel != null)
		{
			panel.clearContent()
			return panel
		}
		
		panel = new Panel(this, this.sidePanelDiv, name, open, onToggle, closable, () => { this.viewer.render() })
		this.panels.push(panel)
		return panel
	}
	
	
	setNotSaved()
	{
		this.undoNeedsNewSlot = true
		
		if (!this.currentNotSaved)
		{
			this.currentNotSaved = true
			this.refreshTitle()
		}
	}
	
	
	setUndoPoint()
	{
		if (!this.undoNeedsNewSlot)
		{
			this.undoStack[this.undoPointer].subviewer = this.viewer.currentSubviewer
			return
		}

		this.undoStack.splice(this.undoPointer + 1, this.undoStack.length - this.undoPointer - 1)		
		
		this.undoStack.push({
			data: this.currentKmpData.clone(),
			subviewer: this.viewer.currentSubviewer,
			currentRouteIndex: this.viewer.subviewerRoutes.currentRouteIndex
		})
		
		this.undoPointer += 1
		this.undoNeedsNewSlot = false
		
		this.currentKmpData.refreshIndices(this.cfg.isBattleTrack)
	}
	
	
	resetUndoStack()
	{
		this.undoNeedsNewSlot = true
		this.undoStack = []
		this.undoPointer = -1
		
		this.currentKmpData.refreshIndices(this.cfg.isBattleTrack)
	}
	
	
	undo()
	{
		if (this.undoPointer <= 0)
			return
		
		this.setUndoPoint()
		
		this.undoPointer -= 1
		this.currentKmpData = this.undoStack[this.undoPointer].data.clone()
		this.currentKmpData.refreshIndices(this.cfg.isBattleTrack)
		this.viewer.setSubviewer(this.undoStack[this.undoPointer].subviewer)
		this.viewer.subviewerRoutes.currentRouteIndex = this.undoStack[this.undoPointer].currentRouteIndex
		
		this.setNotSaved()
		this.undoNeedsNewSlot = false
		this.viewer.setData(this.currentKmpData)
		this.viewer.render()
		this.refreshPanels()
	}
	
	
	redo()
	{
		if (this.undoPointer >= this.undoStack.length - 1)
			return
		
		this.undoPointer += 1
		this.currentKmpData = this.undoStack[this.undoPointer].data.clone()
		this.viewer.setSubviewer(this.undoStack[this.undoPointer].subviewer)
		this.viewer.subviewerRoutes.currentRouteIndex = this.undoStack[this.undoPointer].currentRouteIndex
		
		this.setNotSaved()
		this.undoNeedsNewSlot = false
		this.viewer.setData(this.currentKmpData)
		this.viewer.render()
		this.refreshPanels()
	}
	
	
	async askSaveChanges()
	{
		if (!this.currentNotSaved)
			return true

		if (window.confirm("Save current changes?\n\nOK = Save\nCancel = more options"))
			return await this.saveKmp(this.currentKmpFilename)

		if (window.confirm("Discard unsaved changes?\n\nOK = Don't Save\nCancel = Keep Editing"))
			return true

		return false
	}
	
	
	async newKmp(checkSavePrompt = true)
	{
		if (checkSavePrompt && !await this.askSaveChanges())
			return false
		
		this.currentKmpFilename = null
		this.currentKmpFileHandle = null
		this.currentDirectoryHandle = null
		this.currentKmpData = new KmpData()
		this.currentNotSaved = false
		this.cfg.isBattleTrack = false
		
		this.resetUndoStack()
		
		this.viewer.setData(this.currentKmpData)
		this.setDefaultModel()
		this.refreshPanels()
		this.viewer.render()
		this.noModelLoaded = true
		return true
	}


	async askOpenKmp()
	{
		if (!await this.askSaveChanges())
			return

		if (window.showOpenFilePicker != null)
		{
			const handle = await this.pickFileHandle({
				multiple: false,
				types: [this.buildKmpFileTypeFilter()]
			})

			if (handle == null)
				return

			const bytes = await this.readHandleBytes(handle)
			await this.openKmpFromBytes(handle.name, bytes, {
				kmpHandle: handle
			})
			return
		}

		const file = await this.pickSingleFileFromInput(".kmp")
		if (file == null)
			return

		await this.openKmpFromBytes(file.name, new Uint8Array(await file.arrayBuffer()))
	}
	
	
	async askOpenTrackFolder()
	{
		if (!await this.askSaveChanges())
			return

		if (window.showDirectoryPicker != null)
		{
			const directoryHandle = await this.pickDirectoryHandle()
			if (directoryHandle == null)
				return

			const kmpFile = await this.readFileBytesFromDirectory(directoryHandle, "course.kmp")
			if (kmpFile == null)
			{
				window.alert("No course.kmp was found in the selected folder.")
				return
			}

			const kclFile = await this.readFileBytesFromDirectory(directoryHandle, "course.kcl")

			await this.openKmpFromBytes(directoryHandle.name + "/course.kmp", kmpFile.bytes, {
				kmpHandle: kmpFile.fileHandle,
				directoryHandle,
				kclBytes: (kclFile == null ? null : kclFile.bytes),
				kclFilename: (kclFile == null ? null : directoryHandle.name + "/course.kcl"),
				kclHandle: (kclFile == null ? null : kclFile.fileHandle)
			})
			return
		}

		const files = await this.pickSingleFileFromInput("", true)
		if (files == null || files.length <= 0)
			return

		let courseKmpFile = null
		let courseKclFile = null
		for (const file of files)
		{
			const relativePath = file.webkitRelativePath || file.name
			const lowered = relativePath.toLowerCase()
			if (lowered.endsWith("/course.kmp") || lowered === "course.kmp")
				courseKmpFile = file
			else if (lowered.endsWith("/course.kcl") || lowered === "course.kcl")
				courseKclFile = file
		}

		if (courseKmpFile == null)
		{
			window.alert("No course.kmp was found in the selected folder.")
			return
		}

		const folderPath = (courseKmpFile.webkitRelativePath || courseKmpFile.name)
		const folderName = (folderPath.includes("/") ? folderPath.split("/")[0] : "track")
		const kmpBytes = new Uint8Array(await courseKmpFile.arrayBuffer())
		const kclBytes = (courseKclFile == null ? null : new Uint8Array(await courseKclFile.arrayBuffer()))

		await this.openKmpFromBytes(folderName + "/course.kmp", kmpBytes, {
			kclBytes,
			kclFilename: (kclBytes == null ? null : folderName + "/course.kcl")
		})
	}


	async openKmpFromBytes(filename, bytes, source = {})
	{
		// Detect when run from `npm start`
		if (filename == ".")
			return
		
		try
		{
			this.currentKmpFilename = normalizeFilename(filename)
			this.currentKmpFileHandle = (source.kmpHandle == null ? null : source.kmpHandle)
			this.currentDirectoryHandle = (source.directoryHandle == null ? null : source.directoryHandle)
			this.currentKmpData = KmpData.convertToWorkingFormat(KmpData.load(bytes))
			this.currentNotSaved = false
			
			this.cfg.isBattleTrack = this.currentKmpData.isBattleTrack
			
			this.resetUndoStack()

			if (source.kclBytes != null)
				this.openKclFromBytes(source.kclFilename, source.kclBytes, source.kclHandle)
			else if (this.currentDirectoryHandle != null)
			{
				const kclFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course.kcl")
				if (kclFile != null)
					this.openKclFromBytes(this.currentDirectoryHandle.name + "/course.kcl", kclFile.bytes, kclFile.fileHandle)
				else
					this.setDefaultModel()
			}
			else
				this.setDefaultModel()
			
			this.viewer.setData(this.currentKmpData)
			this.viewer.centerView()
			this.refreshPanels()
			this.viewer.render()
			this.noModelLoaded = false
		}
		catch (e)
		{
			console.error(e)
			alert("KMP open error!\n\n" + e)
			await this.newKmp(false)
		}
	}
	
	
	async saveKmp(filename)
	{
		if (this.currentKmpFileHandle == null && filename == null)
			return await this.saveKmpAs()
		
		try
		{
			const bytes = this.currentKmpData.convertToStorageFormat(this.cfg.isBattleTrack)

			if (this.currentKmpFileHandle != null)
			{
				const writable = await this.currentKmpFileHandle.createWritable()
				await writable.write(new Uint8Array(bytes))
				await writable.close()
				this.currentKmpFilename = normalizeFilename(this.currentKmpFileHandle.name)
			}
			else
			{
				const outName = normalizeFilename(filename || this.getKmpDownloadName())
				this.downloadBytes(bytes, outName)
				this.currentKmpFilename = outName
			}
			
			this.currentNotSaved = false
			this.savedUndoSlot = this.undoPointer
			this.refreshPanels()
			return true
		}
		catch (e)
		{
			console.error(e)
			alert("KMP save error!\n\n" + e)
			return false
		}
	}
	
	
	async saveKmpAs()
	{
		if (window.showSaveFilePicker != null)
		{
			try
			{
				const filename = this.getKmpDownloadName()
				const suggestedName = (filename.includes("/") ? filename.substring(filename.lastIndexOf("/") + 1) : filename)
				const handle = await window.showSaveFilePicker({
					suggestedName,
					types: [this.buildKmpFileTypeFilter()]
				})

				if (handle == null)
					return false

				this.currentKmpFileHandle = handle
				this.currentKmpFilename = normalizeFilename(handle.name)
				return await this.saveKmp(this.currentKmpFilename)
			}
			catch (e)
			{
				if (e.name === "AbortError")
					return false
				throw e
			}
		}

		return await this.saveKmp(this.getKmpDownloadName())
	}
	
	
	setDefaultModel()
	{
		let model = new ModelBuilder()
			.addCube(-5000, -5000, -3, 5000, 5000, 3)
			.calculateNormals()
		
		this.noModelLoaded = true
		this.viewer.setModel(model)
		this.viewer.centerView()
		this.currentKclFilename = null
		this.currentKclFileHandle = null
		this.currentKclBytes = null
	}
	
	
	async openCourseBrres()
	{
		if (this.currentDirectoryHandle == null)
			return

		const brresFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course_model.brres")
		if (brresFile != null)
			this.openBrresFromBytes(this.currentDirectoryHandle.name + "/course_model.brres", brresFile.bytes, brresFile.fileHandle)
	}
	
	
	async openCourseKcl()
	{
		if (this.currentDirectoryHandle == null)
			return

		const kclFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course.kcl")
		if (kclFile != null)
			this.openKclFromBytes(this.currentDirectoryHandle.name + "/course.kcl", kclFile.bytes, kclFile.fileHandle)
	}
	
	
	async openCustomModel()
	{
		if (window.showOpenFilePicker != null)
		{
			const handle = await this.pickFileHandle({
				multiple: false,
				types: [this.buildModelFileTypeFilter()]
			})

			if (handle == null)
				return

			const bytes = await this.readHandleBytes(handle)
			this.openModelFromBytes(handle.name, bytes, handle)
			return
		}

		const file = await this.pickSingleFileFromInput(".obj,.brres,.kcl")
		if (file == null)
			return

		this.openModelFromBytes(file.name, new Uint8Array(await file.arrayBuffer()))
	}
	
	
	openModelFromBytes(filename, bytes, fileHandle = null)
	{
		const ext = getExtension(filename)
		if (ext === ".brres")
		{
			this.openBrresFromBytes(filename, bytes, fileHandle)
			return
		}
		if (ext === ".kcl")
		{
			this.openKclFromBytes(filename, bytes, fileHandle)
			return
		}

		const modelBuilder = require("./util/objLoader.js").ObjLoader.makeModelBuilder(bytes)
		this.viewer.setModel(modelBuilder)
		this.currentKclFilename = null
		this.currentKclFileHandle = null
		this.currentKclBytes = null
		this.currentModelFileHandle = fileHandle
		
		if (this.noModelLoaded)
			this.viewer.centerView()
		
		this.noModelLoaded = false
	}


	openBrresFromBytes(filename, bytes, fileHandle = null)
	{
		if (bytes == null)
			return

		let modelBuilder = null
		try
		{
			modelBuilder = require("./util/brresLoader.js").BrresLoader.load(bytes)
		}
		catch (e)
		{
			window.alert("Error opening BRRES file!\n\n" + e.toString())
			return
		}
		
		this.viewer.setModel(modelBuilder)
		this.currentKclFilename = null
		this.currentKclFileHandle = null
		this.currentKclBytes = null
		this.currentModelFileHandle = fileHandle
		
		if (this.noModelLoaded)
			this.viewer.centerView()
		
		this.noModelLoaded = false
	}
	
	
	openKclFromBytes(filename, bytes, fileHandle = null)
	{
		if (bytes == null)
			return

		let normalizedBytes = (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
		let modelBuilder = KclLoader.load(normalizedBytes, this.cfg, this.hl)
		this.viewer.setModel(modelBuilder)
		this.currentKclFilename = normalizeFilename(filename)
		this.currentKclBytes = new Uint8Array(normalizedBytes)
		this.currentKclFileHandle = fileHandle
		
		if (this.noModelLoaded)
			this.viewer.centerView()
		
		this.noModelLoaded = false
	}


	reloadCurrentKcl()
	{
		if (this.currentKclBytes == null)
			return

		this.openKclFromBytes(this.currentKclFilename, this.currentKclBytes, this.currentKclFileHandle)
	}
}


class Panel
{
	constructor(window, parentDiv, name, open = true, onToggle = null, closable = true, onRefreshView = null)
	{
		this.window = window
		this.parentDiv = parentDiv
		this.name = name
		this.closable = closable
		this.open = open
		this.onToggle = onToggle
		
		this.panelDiv = document.createElement("div")
		this.panelDiv.className = "panel"
		this.parentDiv.appendChild(this.panelDiv)
		
		this.titleButton = document.createElement("button")
		this.titleButton.className = "panelTitle"
		this.titleButton.innerHTML = "▶ " + name
		this.panelDiv.appendChild(this.titleButton)
		
		this.contentDiv = document.createElement("div")
		this.contentDiv.className = "panelContent"
		this.contentDiv.style.display = "none"
		this.panelDiv.appendChild(this.contentDiv)
		
		this.titleButton.onclick = () => this.toggleOpen()
		this.onRefreshView = (onRefreshView != null ? onRefreshView : () => { })
		
		this.onDestroy = []
		
		this.refreshOpen()
	}
	
	
	destroy()
	{
		for (let f of this.onDestroy)
			f()
		
		this.onDestroy = []
		
		if (this.panelDiv)
			this.parentDiv.removeChild(this.panelDiv)
	}
	
	
	clearContent()
	{
		for (let f of this.onDestroy)
			f()
		
		this.onDestroy = []
		
		while (this.contentDiv.lastChild)
			this.contentDiv.removeChild(this.contentDiv.lastChild)
	}
	
	
	setOpen(open)
	{
		let changed = (this.open != open)
		
		this.open = open
		this.refreshOpen()
		
		if (changed && this.onToggle != null)
			this.onToggle(this.open)
	}
	
	
	toggleOpen()
	{
		this.open = !this.open
		this.refreshOpen()
		
		if (this.onToggle != null)
			this.onToggle(this.open)
	}
	
	
	refreshOpen()
	{
		if (this.open)
		{
			this.contentDiv.style.display = "block"
			this.titleButton.innerHTML = "▼ " + this.name
		}
		else
		{
			this.contentDiv.style.display = "none"
			this.titleButton.innerHTML = "▶ " + this.name
		}
	}
	
	
	addGroup(group, str)
	{
		let div = document.createElement("div")
		div.className = "panelGroup"
		
		let labelDiv = document.createElement("div")
		labelDiv.className = "panelRowElement"
		div.appendChild(labelDiv)
		
		let label = document.createElement("div")
		label.className = "panelGroupTitle"
		label.innerHTML = str
		labelDiv.appendChild(label)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return div
	}
	
	
	addSpacer(group, n=1)
	{
		for (let i=0; i < n; i++)
		{
			let div = document.createElement("div")
			div.className = "panelRowElement"
			
			if (group == null)
				this.contentDiv.appendChild(div)
			else
				group.appendChild(div)
		}
		return null
	}


	addText(group, str)
	{
		if (isMacPlatform())
		{
			str = str.replace("Alt", "⌥")
			str = str.replace("Ctrl", "⌘")
		}

		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let text = document.createElement("span")
		text.className = "panelLabel"
		text.innerHTML = str
		div.appendChild(text)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return text
	}
	
	
	addButton(group, str, onclick = null)
	{
		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let label = document.createElement("label")
		div.appendChild(label)
		
		let button = document.createElement("button")
		button.className = "panelButton"
		button.innerHTML = str
		button.onclick = () => { onclick(); this.onRefreshView() }
		
		label.appendChild(button)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return button
	}
	
	
	addCheckbox(group, str, checked = false, onchange = null)
	{
		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let label = document.createElement("label")
		div.appendChild(label)
		
		let checkbox = document.createElement("input")
		checkbox.className = "panelCheckbox"
		checkbox.type = "checkbox"
		checkbox.checked = checked
		checkbox.onchange = () => { onchange(checkbox.checked); this.onRefreshView() }
		
		let text = document.createElement("span")
		text.className = "panelLabel"
		text.innerHTML = str
		
		label.appendChild(checkbox)
		label.appendChild(text)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return checkbox
	}
	
	
	addSlider(group, str, min = 0, max = 1, value = 0, step = 0.1, onchange = null)
	{
		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let label = document.createElement("label")
		div.appendChild(label)
		
		let slider = document.createElement("input")
		slider.className = "panelCheckbox"
		slider.type = "range"
		slider.min = min
		slider.max = max
		slider.step = step
		slider.value = value
		slider.oninput = () => { onchange(slider.value); this.onRefreshView() }
		
		let text = document.createElement("span")
		text.className = "panelLabel"
		text.innerHTML = str
		
		label.appendChild(text)
		label.appendChild(slider)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return slider
	}
	
	
	addSelectionNumericInput(group, str, min = 0, max = 1, values = 0, step = 0.1, dragStep = 0.1, enabled = true, multiedit = false, onchange = null, modify = null)
	{
		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let label = document.createElement("label")
		div.appendChild(label)
		
		if (!(values instanceof Array))
			values = [values]
		
		if (onchange == null)
			onchange = (x, i) => { }
		
		if (modify == null)
			modify = (x) => { return x }
		
		let input = document.createElement("input")
		input.className = "panelNumericInput"
		input.type = "input"
		input.value = (enabled && values.every(v => v === values[0]) ? values[0] : "")
		input.disabled = !enabled

		input.lastInput = input.value
		
		let inFocus = false
		input.onfocus = () => { inFocus = true; this.window.setUndoPoint() }
		input.onblur = () => { inFocus = false; this.window.setUndoPoint(); this.window.viewer.canvas.focus(); input.value = modify(input.lastInput) }
		input.onkeydown = (ev) => {
			if (inFocus)
			{
				if (ev.key === "Enter")
					input.value = modify(input.lastInput)
				else
					ev.stopPropagation()
			}
		}
		
		let safeParseFloat = (s) =>
		{
			let x = 0
			if (s.substring(0, 2) == '0x')
				x = parseInt(s, 16)
			else
				x = parseFloat(s)

			if (isNaN(x) || !isFinite(x))
				return 0
			
			return x
		}
		
		let clampValue = (x) =>
		{
			if (step != null)
				x = Math.round(x / step) * step
			
			x = Math.max(x, min)
			x = Math.min(x, max)
			return x
		}
		
		let valueDelta = 0
		
		input.oninput = () =>
		{
			if (!enabled)
				return
			
			valueDelta = 0
			
			for (let i = 0; i < values.length; i++)
				onchange(input.value != "" ? clampValue(safeParseFloat(input.value)) : values[i], i)
			
			input.lastInput = (input.value != "" ? clampValue(safeParseFloat(input.value)) : lastInput)

			this.onRefreshView()
		}
		
		let text = document.createElement("div")
		text.className = "panelNumericInputLabel"
		text.innerHTML = str
		
		let mouseDown = false
		let lastEv = null
		text.onmousedown = (ev) =>
		{
			if (!enabled)
				return
			
			lastEv = ev
			mouseDown = true
			this.window.setUndoPoint()
		}
		
		let onMouseUp = (ev) =>
		{
			if (!mouseDown)
				return
			
			mouseDown = false
		}
		
		let onMouseMove = (ev) =>
		{
			if (mouseDown && dragStep > 0)
			{
				let dy = lastEv.screenY - ev.screenY
				let value = safeParseFloat(input.value)
				
				valueDelta += (dy * dragStep)
				value += (dy * dragStep)
				value = clampValue(value)
				
				if (!multiedit)
				{
					input.value = modify(value.toFixed(5))
					for (let i = 0; i < values.length; i++)
						onchange(value, i)
				}
				else
				{
					input.value = values.every(v => v === values[0]) ? modify(clampValue(values[0] + valueDelta)) : ""
					for (let i = 0; i < values.length; i++)
						onchange(clampValue(values[i] + valueDelta), i)
				}
				
				lastEv = ev
				input.lastInput = input.value
				
				this.onRefreshView()
				
				ev.preventDefault()
			}
		}
		
		document.addEventListener("mousemove", onMouseMove)
		document.addEventListener("mouseup", onMouseUp)
		document.addEventListener("mouseleave", onMouseUp)
		
		this.onDestroy.push(() =>
		{
			document.removeEventListener("mousemove", onMouseMove)
			document.removeEventListener("mouseup", onMouseUp)
			document.removeEventListener("mouseleave", onMouseUp)
		})
		
		label.appendChild(text)
		label.appendChild(input)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return input
	}
	
	
	addSelectionDropdown(group, str, values = 0, options = [], enabled = true, multiedit = false, onchange = null)
	{
		let div = document.createElement("div")
		div.className = "panelRowElement"
		
		let label = document.createElement("label")
		div.appendChild(label)
		
		if (!(values instanceof Array))
			values = [values]
		
		if (onchange == null)
			onchange = (x, i) => { }
		
		let select = document.createElement("select")
		select.className = "panelSelect"
		select.disabled = !enabled
		
		for (let option of options)
		{
			let selectOption = document.createElement("option")
			selectOption.innerHTML = option.str
			selectOption.value = option.value
			select.appendChild(selectOption)
		}

		if (enabled && values.every(v => v === values[0]))
			select.selectedIndex = options.findIndex(op => op.value == values[0])
		else
			select.selectedIndex = -1
		
		select.onchange = () =>
		{
			if (select.selectedIndex < 0)
				return
			
			this.window.setUndoPoint()
			
			for (let i = 0; i < values.length; i++)
				onchange(options[select.selectedIndex].value, i)
			
			this.onRefreshView()
		}
		
		let text = document.createElement("div")
		text.className = "panelInputLabel"
		text.innerHTML = str
		
		label.appendChild(text)
		label.appendChild(select)
		
		if (group == null)
			this.contentDiv.appendChild(div)
		else
			group.appendChild(div)
		
		return select
	}
}


module.exports = { main, MainWindow, gMainWindow }

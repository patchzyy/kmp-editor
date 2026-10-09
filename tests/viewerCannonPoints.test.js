const assert = require("node:assert/strict")
const { test } = require("node:test")
const { ViewerCannonPoints } = require("../src/viewer/viewerCannonPoints.js")

for (const platform of ["web", "desktop"])
	test(`cannon settings and collision highlighting work on ${platform}`, () =>
	{
		const controls = new Map()
		const panel = {
			addText() {}, addSpacer() {}, addButton() {}, addGroup() { return {} },
			addCheckbox(group, label, value, onchange) { controls.set(label, onchange) },
			addSelectionNumericInput(...args) { controls.set(args[1], args[9]) },
			addSelectionDropdown(...args) { controls.set(args[1], args[6]) }
		}
		let reloads = 0
		let dirty = false
		const hl = { reset() { this.baseType = -1; this.basicEffect = -1 } }
		const window = {
			addPanel: () => panel, hl, currentKclFilename: "course.kcl",
			setNotSaved() { dirty = true }
		}
		if (platform === "web")
			window.reloadCurrentKcl = () => { reloads++ }
		else
			window.openKcl = filename => { assert.equal(filename, "course.kcl"); reloads++ }
		const point = { selected: true, pos: { x: 1, y: 2, z: 3 }, rotation: { x: 0, y: 0, z: 0 }, id: 0, effect: 0 }
		const viewer = Object.create(ViewerCannonPoints.prototype)
		Object.assign(viewer, { window, viewer: { cfg: { cannonsEnableKclHighlight: true } }, data: { cannonPoints: { nodes: [point] } } })

		viewer.refreshPanels()
		for (const label of ["Dest. X", "Dest. Y", "Dest. Z", "Rot. X", "Rot. Y", "Rot. Z", "ID", "Effect"])
			assert.equal(typeof controls.get(label), "function", label)
		assert.equal(reloads, 1)
		assert.equal(hl.baseType, 0x11)
		assert.equal(hl.basicEffect, 0)
		controls.get("Dest. Y")(100, 0)
		controls.get("Effect")(2, 0)
		assert.equal(point.pos.z, -100)
		assert.equal(point.effect, 2)
		assert.equal(dirty, true)

		controls.get("Highlight selected trigger KCL")(false)
		assert.equal(hl.baseType, -1)
		assert.equal(reloads, 2)
		point.selected = false
		viewer.refreshPanels()
		assert.equal(viewer.highlighting, false)
		assert.equal(reloads, 3)
	})

function readUInt32BE(bytes, offset)
{
	return (
		(bytes[offset + 0] << 24) |
		(bytes[offset + 1] << 16) |
		(bytes[offset + 2] << 8) |
		(bytes[offset + 3] << 0)
	) >>> 0
}


function writeUInt32BE(bytes, offset, value)
{
	bytes[offset + 0] = (value >>> 24) & 0xff
	bytes[offset + 1] = (value >>> 16) & 0xff
	bytes[offset + 2] = (value >>> 8) & 0xff
	bytes[offset + 3] = (value >>> 0) & 0xff
}


function align(x, n)
{
	return ((x + n - 1) / n | 0) * n
}


function normalizeArchivePath(path)
{
	if (path == null)
		return ""

	return path
		.replace(new RegExp("\\\\", "g"), "/")
		.replace(/^\/+/, "")
		.replace(/\/+/g, "/")
}


class SzsArchive
{
	static parse(bytes)
	{
		let input = (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
		let archiveBytes = input
		let wasCompressed = false

		if (input.length >= 4 && input[0] == 0x59 && input[1] == 0x61 && input[2] == 0x7a && input[3] == 0x30)
		{
			archiveBytes = SzsArchive.decodeYaz0(input)
			wasCompressed = true
		}

		let entries = SzsArchive.parseU8(archiveBytes)
		return { entries, wasCompressed }
	}


	static make(entries, compress = true)
	{
		let u8 = SzsArchive.buildU8(entries)
		return (compress ? SzsArchive.encodeYaz0LiteralOnly(u8) : u8)
	}


	static cloneEntries(entries)
	{
		let map = new Map()
		if (entries == null)
			return map

		for (let [path, bytes] of entries)
			map.set(path, new Uint8Array(bytes))

		return map
	}


	static findPath(entries, filename)
	{
		if (entries == null || filename == null)
			return null

		let lowered = filename.toLowerCase()
		for (let [path, _] of entries)
		{
			let p = path.toLowerCase()
			if (p == lowered || p.endsWith("/" + lowered))
				return path
		}
		return null
	}


	static parseU8(bytes)
	{
		if (bytes.length < 0x20)
			throw "szs: archive too small"

		let magic = readUInt32BE(bytes, 0)
		if (magic != 0x55aa382d)
			throw "szs: invalid U8 magic"

		let rootOffset = readUInt32BE(bytes, 4)
		if (rootOffset + 12 > bytes.length)
			throw "szs: invalid root node offset"

		let rootTypeAndName = readUInt32BE(bytes, rootOffset)
		let rootType = rootTypeAndName >>> 24
		if (rootType != 1)
			throw "szs: invalid root node"

		let nodeCount = readUInt32BE(bytes, rootOffset + 8)
		let nodeTableSize = nodeCount * 12
		let stringTableOffset = rootOffset + nodeTableSize
		if (stringTableOffset > bytes.length)
			throw "szs: invalid node table size"

		let nodes = []
		for (let i = 0; i < nodeCount; i++)
		{
			let offset = rootOffset + i * 12
			let typeAndName = readUInt32BE(bytes, offset + 0)
			nodes.push({
				type: typeAndName >>> 24,
				nameOffset: typeAndName & 0x00ffffff,
				dataOffset: readUInt32BE(bytes, offset + 4),
				size: readUInt32BE(bytes, offset + 8),
				name: ""
			})
		}

		let readCString = (offset) =>
		{
			let chars = []
			for (let i = offset; i < bytes.length; i++)
			{
				let c = bytes[i]
				if (c == 0)
					break
				chars.push(c)
			}
			return new TextDecoder("utf-8").decode(new Uint8Array(chars))
		}

		for (let i = 0; i < nodes.length; i++)
		{
			let nameOffset = stringTableOffset + nodes[i].nameOffset
			if (nameOffset < 0 || nameOffset >= bytes.length)
				nodes[i].name = ""
			else
				nodes[i].name = readCString(nameOffset)
		}

		let entries = new Map()

		let walkDirectory = (dirIndex, parentPath) =>
		{
			let endIndex = nodes[dirIndex].size
			let i = dirIndex + 1
			while (i < endIndex)
			{
				let node = nodes[i]
				let fullPath = (parentPath == "" ? node.name : parentPath + "/" + node.name)
				if (node.type == 1)
				{
					walkDirectory(i, fullPath)
					i = node.size
				}
				else
				{
					let dataStart = node.dataOffset
					let dataEnd = node.dataOffset + node.size
					if (dataStart < 0 || dataEnd > bytes.length)
						throw "szs: invalid file range"
					entries.set(fullPath, bytes.slice(dataStart, dataEnd))
					i += 1
				}
			}
		}

		walkDirectory(0, "")
		return entries
	}


	static buildU8(entries)
	{
		let normalizedEntries = []
		for (let [path, bytes] of entries)
		{
			let normalizedPath = normalizeArchivePath(path)
			if (normalizedPath == "")
				continue

			let fileBytes = (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
			normalizedEntries.push({ path: normalizedPath, bytes: fileBytes })
		}

		let root = {
			kind: "dir",
			name: "",
			children: [],
			childDirs: new Map(),
			childFiles: new Map()
		}

		for (let entry of normalizedEntries)
		{
			let parts = entry.path.split("/").filter(x => x != "")
			if (parts.length == 0)
				continue

			let node = root
			for (let i = 0; i < parts.length - 1; i++)
			{
				let dirName = parts[i]
				if (!node.childDirs.has(dirName))
				{
					let child = {
						kind: "dir",
						name: dirName,
						children: [],
						childDirs: new Map(),
						childFiles: new Map()
					}
					node.childDirs.set(dirName, child)
					node.children.push(child)
				}
				node = node.childDirs.get(dirName)
			}

			let fileName = parts[parts.length - 1]
			if (node.childFiles.has(fileName))
			{
				node.childFiles.get(fileName).bytes = entry.bytes
			}
			else
			{
				let fileNode = { kind: "file", name: fileName, bytes: entry.bytes }
				node.childFiles.set(fileName, fileNode)
				node.children.push(fileNode)
			}
		}

		let nodes = []
		let appendNode = (node, parentIndex) =>
		{
			if (node.kind == "dir")
			{
				let index = nodes.length
				nodes.push({
					kind: "dir",
					name: node.name,
					parentIndex,
					nextIndex: 0,
					nameOffset: 0
				})

				for (let child of node.children)
					appendNode(child, index)

				nodes[index].nextIndex = nodes.length
			}
			else
			{
				nodes.push({
					kind: "file",
					name: node.name,
					nameOffset: 0,
					dataOffset: 0,
					size: node.bytes.length,
					bytes: node.bytes
				})
			}
		}

		appendNode(root, 0)

		let stringTable = [0]
		let encoder = new TextEncoder()
		for (let i = 0; i < nodes.length; i++)
		{
			let node = nodes[i]
			if (i == 0)
			{
				node.nameOffset = 0
				continue
			}

			node.nameOffset = stringTable.length
			let nameBytes = encoder.encode(node.name)
			for (let b of nameBytes)
				stringTable.push(b)
			stringTable.push(0)
		}

		let rootOffset = 0x20
		let nodeTableSize = nodes.length * 12
		let stringOffset = rootOffset + nodeTableSize
		let headerSize = stringOffset + stringTable.length
		let dataOffset = align(headerSize, 0x20)

		let curDataOffset = dataOffset
		for (let node of nodes)
		{
			if (node.kind != "file")
				continue

			curDataOffset = align(curDataOffset, 0x20)
			node.dataOffset = curDataOffset
			curDataOffset += node.size
		}

		let out = new Uint8Array(curDataOffset)
		writeUInt32BE(out, 0x00, 0x55aa382d)
		writeUInt32BE(out, 0x04, rootOffset)
		writeUInt32BE(out, 0x08, headerSize)
		writeUInt32BE(out, 0x0c, dataOffset)

		for (let i = 0; i < nodes.length; i++)
		{
			let node = nodes[i]
			let offset = rootOffset + i * 12
			let type = (node.kind == "dir" ? 1 : 0)
			let typeAndName = ((type << 24) | node.nameOffset) >>> 0
			writeUInt32BE(out, offset + 0, typeAndName)
			if (node.kind == "dir")
			{
				writeUInt32BE(out, offset + 4, i == 0 ? 0 : node.parentIndex)
				writeUInt32BE(out, offset + 8, node.nextIndex)
			}
			else
			{
				writeUInt32BE(out, offset + 4, node.dataOffset)
				writeUInt32BE(out, offset + 8, node.size)
			}
		}

		for (let i = 0; i < stringTable.length; i++)
			out[stringOffset + i] = stringTable[i]

		for (let node of nodes)
		{
			if (node.kind != "file")
				continue
			out.set(node.bytes, node.dataOffset)
		}

		return out
	}


	static decodeYaz0(bytes)
	{
		let outSize = readUInt32BE(bytes, 4)
		let out = new Uint8Array(outSize)
		let srcPos = 16
		let dstPos = 0
		let code = 0
		let validBits = 0

		while (dstPos < outSize)
		{
			if (validBits == 0)
			{
				code = bytes[srcPos++]
				validBits = 8
			}

			if ((code & 0x80) != 0)
			{
				out[dstPos++] = bytes[srcPos++]
			}
			else
			{
				let b1 = bytes[srcPos++]
				let b2 = bytes[srcPos++]
				let dist = ((b1 & 0x0f) << 8) | b2
				let copyPos = dstPos - (dist + 1)

				let length = b1 >> 4
				if (length == 0)
					length = bytes[srcPos++] + 0x12
				else
					length += 2

				for (let i = 0; i < length; i++)
				{
					out[dstPos++] = out[copyPos++]
					if (dstPos >= outSize)
						break
				}
			}

			code = (code << 1) & 0xff
			validBits -= 1
		}

		return out
	}


	static encodeYaz0LiteralOnly(bytes)
	{
		let input = (bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
		let out = []
		out.push(0x59, 0x61, 0x7a, 0x30)

		let size = input.length >>> 0
		out.push((size >>> 24) & 0xff, (size >>> 16) & 0xff, (size >>> 8) & 0xff, size & 0xff)
		out.push(0, 0, 0, 0, 0, 0, 0, 0)

		let pos = 0
		while (pos < input.length)
		{
			let count = Math.min(8, input.length - pos)
			out.push(0xff)
			for (let i = 0; i < count; i++)
				out.push(input[pos++])
		}

		return new Uint8Array(out)
	}
}


if (module)
	module.exports = { SzsArchive, normalizeArchivePath }

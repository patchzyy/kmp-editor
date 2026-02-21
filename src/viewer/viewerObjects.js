const { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require("../gl/scene.js")
const { PointViewer } = require("./pointViewer.js")
const { ModelBuilder } = require("../util/modelBuilder.js")
const { Vec3 } = require("../math/vec3.js")
const { Mat4 } = require("../math/mat4.js")
const { Geometry } = require("../math/geometry.js")

let objectNames = []
objectNames[0x1]   = "airblock          "
objectNames[0x2]   = "Psea              "
objectNames[0x3]   = "lensFX            "
objectNames[0x4]   = "venice_nami       "
objectNames[0x5]   = "sound_river       "
objectNames[0x6]   = "sound_water_fall  "
objectNames[0x7]   = "pocha             "
objectNames[0x8]   = "sound_lake        "
objectNames[0x9]   = "sound_big_fall    "
objectNames[0xa]   = "sound_sea         "
objectNames[0xb]   = "sound_fountain    "
objectNames[0xc]   = "sound_volcano     "
objectNames[0xd]   = "sound_audience    "
objectNames[0xe]   = "sound_big_river   "
objectNames[0xf]   = "sound_sand_fall   "
objectNames[0x10]  = "sound_lift        "
objectNames[0x11]  = "pochaYogan        "
objectNames[0x12]  = "entry             "
objectNames[0x13]  = "pochaMori         "
objectNames[0x14]  = "eline_control     "
objectNames[0x15]  = "sound_Mii         "
objectNames[0x16]  = "begoman_manager   "
objectNames[0x17]  = "ice               "
objectNames[0x18]  = "startline2D       "
objectNames[0x65]  = "itembox           "
objectNames[0x66]  = "DummyPole         "
objectNames[0x67]  = "flag              "
objectNames[0x68]  = "flagBlend         "
objectNames[0x69]  = "gnd_sphere        "
objectNames[0x6a]  = "gnd_trapezoid     "
objectNames[0x6b]  = "gnd_wave1         "
objectNames[0x6c]  = "gnd_wave2         "
objectNames[0x6d]  = "gnd_wave3         "
objectNames[0x6e]  = "gnd_wave4         "
objectNames[0x6f]  = "sun               "
objectNames[0x70]  = "woodbox           "
objectNames[0x71]  = "KmoonZ            "
objectNames[0x72]  = "sunDS             "
objectNames[0x73]  = "coin              "
objectNames[0x74]  = "ironbox           "
objectNames[0x75]  = "ItemDirect        "
objectNames[0x76]  = "s_itembox         "
objectNames[0x77]  = "pile_coin         "
objectNames[0xc9]  = "f_itembox         "
objectNames[0xca]  = "MashBalloonGC     "
objectNames[0xcb]  = "WLwallGC          "
objectNames[0xcc]  = "CarA1             "
objectNames[0xcd]  = "basabasa          "
objectNames[0xce]  = "HeyhoShipGBA      "
objectNames[0xcf]  = "koopaBall         "
objectNames[0xd0]  = "kart_truck        "
objectNames[0xd1]  = "car_body          "
objectNames[0xd2]  = "skyship           "
objectNames[0xd3]  = "w_woodbox         "
objectNames[0xd4]  = "w_itembox         "
objectNames[0xd5]  = "w_itemboxline     "
objectNames[0xd6]  = "VolcanoBall1      "
objectNames[0xd7]  = "penguin_s         "
objectNames[0xd8]  = "penguin_m         "
objectNames[0xd9]  = "penguin_l         "
objectNames[0xda]  = "castleballoon1    "
objectNames[0xdb]  = "dossunc           "
objectNames[0xdc]  = "dossunc_soko      "
objectNames[0xdd]  = "boble             "
objectNames[0xde]  = "K_bomb_car        "
objectNames[0xdf]  = "K_bomb_car_dummy  "
objectNames[0xe0]  = "car_body_dummy    "
objectNames[0xe1]  = "kart_truck_dummy  "
objectNames[0xe2]  = "hanachan          "
objectNames[0xe3]  = "seagull           "
objectNames[0xe4]  = "moray             "
objectNames[0xe5]  = "crab              "
objectNames[0xe6]  = "basabasa_dummy    "
objectNames[0xe7]  = "CarA2             "
objectNames[0xe8]  = "CarA3             "
objectNames[0xe9]  = "Hwanwan           "
objectNames[0xea]  = "HeyhoBallGBA      "
objectNames[0xeb]  = "Twanwan           "
objectNames[0xec]  = "cruiserR          "
objectNames[0xed]  = "bird              "
objectNames[0xee]  = "sin_itembox       "
objectNames[0xef]  = "Twanwan_ue        "
objectNames[0xf0]  = "BossHanachan      "
objectNames[0xf1]  = "Kdossunc          "
objectNames[0xf2]  = "BossHanachanHead  "
objectNames[0xf3]  = "K_bomb_car1       "
objectNames[0x12d] = "dummy             "
objectNames[0x12e] = "dokan_sfc         "
objectNames[0x12f] = "castletree1       "
objectNames[0x130] = "castletree1c      "
objectNames[0x131] = "castletree2       "
objectNames[0x132] = "castleflower1     "
objectNames[0x133] = "mariotreeGC       "
objectNames[0x134] = "mariotreeGCc      "
objectNames[0x135] = "donkytree1GC      "
objectNames[0x136] = "donkytree2GC      "
objectNames[0x137] = "peachtreeGC       "
objectNames[0x138] = "peachtreeGCc      "
objectNames[0x139] = "npc_mii_a         "
objectNames[0x13a] = "npc_mii_b         "
objectNames[0x13b] = "npc_mii_c         "
objectNames[0x13c] = "obakeblockSFCc    "
objectNames[0x13d] = "WLarrowGC         "
objectNames[0x13e] = "WLscreenGC        "
objectNames[0x13f] = "WLdokanGC         "
objectNames[0x140] = "MarioGo64c        "
objectNames[0x141] = "PeachHunsuiGC     "
objectNames[0x142] = "kinokoT1          "
objectNames[0x143] = "kinokoT2          "
objectNames[0x144] = "pylon01           "
objectNames[0x145] = "PalmTree          "
objectNames[0x146] = "parasol           "
objectNames[0x147] = "cruiser           "
objectNames[0x148] = "K_sticklift00     "
objectNames[0x149] = "heyho2            "
objectNames[0x14a] = "HeyhoTreeGBAc     "
objectNames[0x14b] = "MFaceBill         "
objectNames[0x14c] = "truckChimSmk      "
objectNames[0x14d] = "MiiObj01          "
objectNames[0x14e] = "MiiObj02          "
objectNames[0x14f] = "MiiObj03          "
objectNames[0x150] = "gardentreeDS      "
objectNames[0x151] = "gardentreeDSc     "
objectNames[0x152] = "FlagA1            "
objectNames[0x153] = "FlagA2            "
objectNames[0x154] = "FlagB1            "
objectNames[0x155] = "FlagB2            "
objectNames[0x156] = "FlagA3            "
objectNames[0x157] = "DKtreeA64         "
objectNames[0x158] = "DKtreeA64c        "
objectNames[0x159] = "DKtreeB64         "
objectNames[0x15a] = "DKtreeB64c        "
objectNames[0x15b] = "TownTreeDSc       "
objectNames[0x15c] = "Piston            "
objectNames[0x15d] = "oilSFC            "
objectNames[0x15e] = "DKmarutaGCc       "
objectNames[0x15f] = "DKropeGCc         "
objectNames[0x160] = "mii_balloon       "
objectNames[0x161] = "windmill          "
objectNames[0x162] = "dossun            "
objectNames[0x163] = "TownTreeDS        "
objectNames[0x164] = "Ksticketc         "
objectNames[0x165] = "monte_a           "
objectNames[0x166] = "MiiStatueM1       "
objectNames[0x167] = "ShMiiObj01        "
objectNames[0x168] = "ShMiiObj02        "
objectNames[0x169] = "ShMiiObj03        "
objectNames[0x16a] = "Hanabi            "
objectNames[0x16b] = "miiposter         "
objectNames[0x16c] = "dk_miiobj00       "
objectNames[0x16d] = "light_house       "
objectNames[0x16e] = "r_parasol         "
objectNames[0x16f] = "obakeblock2SFCc   "
objectNames[0x170] = "obakeblock3SFCc   "
objectNames[0x171] = "koopaFigure       "
objectNames[0x172] = "pukupuku          "
objectNames[0x173] = "v_stand1          "
objectNames[0x174] = "v_stand2          "
objectNames[0x175] = "leaf_effect       "
objectNames[0x176] = "karehayama        "
objectNames[0x177] = "EarthRing         "
objectNames[0x178] = "SpaceSun          "
objectNames[0x179] = "BlackHole         "
objectNames[0x17a] = "StarRing          "
objectNames[0x17b] = "M_obj_kanban      "
objectNames[0x17c] = "MiiStatueL1       "
objectNames[0x17d] = "MiiStatueD1       "
objectNames[0x17e] = "MiiSphinxY1       "
objectNames[0x17f] = "MiiSphinxY2       "
objectNames[0x180] = "FlagA5            "
objectNames[0x181] = "CarB              "
objectNames[0x182] = "FlagA4            "
objectNames[0x183] = "Steam             "
objectNames[0x184] = "Alarm             "
objectNames[0x185] = "group_monte_a     "
objectNames[0x186] = "MiiStatueL2       "
objectNames[0x187] = "MiiStatueD2       "
objectNames[0x188] = "MiiStatueP1       "
objectNames[0x189] = "SentakuDS         "
objectNames[0x18a] = "fks_screen_wii    "
objectNames[0x18b] = "KoopaFigure64     "
objectNames[0x18c] = "b_teresa          "
objectNames[0x18d] = "MiiStatueDK1      "
objectNames[0x18e] = "MiiKanban         "
objectNames[0x18f] = "BGteresaSFC       "
objectNames[0x191] = "kuribo            "
objectNames[0x192] = "choropu           "
objectNames[0x193] = "cow               "
objectNames[0x194] = "pakkun_f          "
objectNames[0x195] = "WLfirebarGC       "
objectNames[0x196] = "wanwan            "
objectNames[0x197] = "poihana           "
objectNames[0x198] = "DKrockGC          "
objectNames[0x199] = "sanbo             "
objectNames[0x19a] = "choropu2          "
objectNames[0x19b] = "TruckWagon        "
objectNames[0x19c] = "heyho             "
objectNames[0x19d] = "Press             "
objectNames[0x19e] = "Press_soko        "
objectNames[0x19f] = "pile              "
objectNames[0x1a0] = "choropu_ground    "
objectNames[0x1a1] = "WLfireringGC      "
objectNames[0x1a2] = "pakkun_dokan      "
objectNames[0x1a3] = "begoman_spike     "
objectNames[0x1a4] = "FireSnake         "
objectNames[0x1a5] = "koopaFirebar      "
objectNames[0x1a6] = "Epropeller        "
objectNames[0x1a7] = "dc_pillar_c       "
objectNames[0x1a8] = "FireSnake_v       "
objectNames[0x1a9] = "honeBall          "
objectNames[0x1aa] = "puchi_pakkun      "
objectNames[0x1ab] = "sanbo_big         "
objectNames[0x1ac] = "sanbo_big         "
objectNames[0x1f5] = "kinoko_ud         "
objectNames[0x1f6] = "kinoko_bend       "
objectNames[0x1f7] = "VolcanoRock1      "
objectNames[0x1f8] = "bulldozer_left    "
objectNames[0x1f9] = "bulldozer_right   "
objectNames[0x1fa] = "kinoko_nm         "
objectNames[0x1fb] = "Crane             "
objectNames[0x1fc] = "VolcanoPiece      "
objectNames[0x1fd] = "FlamePole         "
objectNames[0x1fe] = "TwistedWay        "
objectNames[0x1ff] = "TownBridgeDSc     "
objectNames[0x200] = "DKship64          "
objectNames[0x201] = "kinoko_kuki       "
objectNames[0x202] = "DKturibashiGCc    "
objectNames[0x203] = "FlamePoleEff      "
objectNames[0x204] = "aurora            "
objectNames[0x205] = "venice_saku       "
objectNames[0x206] = "casino_roulette   "
objectNames[0x207] = "BossField01_OBJ1  "
objectNames[0x208] = "dc_pillar         "
objectNames[0x209] = "dc_sandcone       "
objectNames[0x20a] = "venice_hasi       "
objectNames[0x20b] = "venice_gondola    "
objectNames[0x20c] = "quicksand         "
objectNames[0x20d] = "bblock            "
objectNames[0x20e] = "ami               "
objectNames[0x20f] = "M_obj_jump        "
objectNames[0x210] = "starGate          "
objectNames[0x211] = "RM_ring1          "
objectNames[0x212] = "FlamePole_v       "
objectNames[0x213] = "M_obj_s_jump      "
objectNames[0x214] = "InsekiA           "
objectNames[0x215] = "InsekiB           "
objectNames[0x216] = "FlamePole_v_big   "
objectNames[0x217] = "Mdush             "
objectNames[0x218] = "HP_pipe           "
objectNames[0x219] = "DemoCol           "
objectNames[0x21a] = "M_obj_s_jump2     "
objectNames[0x21b] = "M_obj_jump2       "
objectNames[0x259] = "DonkyCannonGC     "
objectNames[0x25a] = "BeltEasy          "
objectNames[0x25b] = "BeltCrossing      "
objectNames[0x25c] = "BeltCurveA        "
objectNames[0x25d] = "BeltCurveB        "
objectNames[0x25e] = "escalator         "
objectNames[0x25f] = "DonkyCannon_wii   "
objectNames[0x260] = "escalator_group   "
objectNames[0x261] = "tree_cannon       "
objectNames[0x2bd] = "group_enemy_b     "
objectNames[0x2be] = "group_enemy_c     "
objectNames[0x2bf] = "taimatsu          "
objectNames[0x2c0] = "truckChimSmkW     "
objectNames[0x2c1] = "Mstand            "
objectNames[0x2c2] = "dkmonitor         "
objectNames[0x2c3] = "group_enemy_a     "
objectNames[0x2c4] = "FlagB3            "
objectNames[0x2c5] = "spot              "
objectNames[0x2c6] = "group_enemy_d     "
objectNames[0x2c7] = "FlagB4            "
objectNames[0x2c8] = "group_enemy_e     "
objectNames[0x2c9] = "group_monte_L     "
objectNames[0x2ca] = "group_enemy_f     "
objectNames[0x2cb] = "FallBsA           "
objectNames[0x2cc] = "FallBsB           "
objectNames[0x2cd] = "FallBsC           "
objectNames[0x2ce] = "volsmk            "
objectNames[0x2cf] = "ridgemii00        "
objectNames[0x2d0] = "Flash_L           "
objectNames[0x2d1] = "Flash_B           "
objectNames[0x2d2] = "Flash_W           "
objectNames[0x2d3] = "Flash_M           "
objectNames[0x2d4] = "Flash_S           "
objectNames[0x2d5] = "MiiSignNoko       "
objectNames[0x2d6] = "UtsuboDokan       "
objectNames[0x2d7] = "Spot64            "
objectNames[0x2d8] = "DemoEf            "
objectNames[0x2d9] = "Fall_MH           "
objectNames[0x2da] = "Fall_Y            "
objectNames[0x2db] = "DemoJugemu        "
objectNames[0x2dc] = "group_enemy_a_demo"
objectNames[0x2dd] = "group_monte_a_demo"
objectNames[0x2de] = "volfall           "
objectNames[0x2df] = "MiiStatueM2       "
objectNames[0x2e0] = "RhMiiKanban       "
objectNames[0x2e1] = "MiiStatueL3       "
objectNames[0x2e2] = "MiiSignWario      "
objectNames[0x2e3] = "MiiStatueBL1      "
objectNames[0x2e4] = "MiiStatueBD1      "
objectNames[0x2e5] = "Kamifubuki        "
objectNames[0x2e6] = "Crescent64        "
objectNames[0x2e7] = "MiiSighKino       "
objectNames[0x2e8] = "MiiObjD01         "
objectNames[0x2e9] = "MiiObjD02         "
objectNames[0x2ea] = "MiiObjD03         "
objectNames[0x2eb] = "mare_a            "
objectNames[0x2ec] = "mare_b            "
objectNames[0x2ed] = "EnvKareha         "
objectNames[0x2ee] = "EnvFire           "
objectNames[0x2ef] = "EnvSnow           "
objectNames[0x2f0] = "M_obj_start       "
objectNames[0x2f1] = "EnvKarehaUp       "
objectNames[0x2f2] = "M_obj_kanban_y    "
objectNames[0x2f3] = "DKfalls           "

const conditionalModeOptions = [
	{ str: "None", value: 0 },
	{ str: "Lap Range", value: 1 },
	{ str: "Checkpoint Range", value: 2 },
	{ str: "Lap Range (Inverted)", value: 3 },
	{ str: "Checkpoint Range (Inverted)", value: 4 },
	{ str: "Lap Progress Range", value: 5 },
	{ str: "Lap Progress Range (Inverted)", value: 6 },
]

function clampCondIndex(value)
{
	value = Math.round(value)
	if (!isFinite(value))
		value = 0
	return Math.max(0, Math.min(7, value))
}

function clampCondPercent(value)
{
	value = Math.round(value)
	if (!isFinite(value))
		value = 0
	return Math.max(0, Math.min(100, value))
}

function isLapCondMode(mode)
{
	return mode == 1 || mode == 3 || mode == 5 || mode == 6
}

function isLapProgressCondMode(mode)
{
	return mode == 5 || mode == 6
}

function isInvertedCondMode(mode)
{
	return mode == 3 || mode == 4 || mode == 6
}

function getCondPadding(p)
{
	return (p.xpfThing ?? 0) & 0xffff
}

function getCondProgressStartPercent(p)
{
	return clampCondPercent((getCondPadding(p) >> 8) & 0xff)
}

function getCondProgressEndPercent(p)
{
	return clampCondPercent(getCondPadding(p) & 0xff)
}

function setCondProgressStartPercent(p, value)
{
	let padding = getCondPadding(p)
	p.xpfThing = ((clampCondPercent(value) << 8) | (padding & 0xff)) & 0xffff
}

function setCondProgressEndPercent(p, value)
{
	let padding = getCondPadding(p)
	p.xpfThing = ((padding & 0xff00) | clampCondPercent(value)) & 0xffff
}

function getCondDisplayStart(p)
{
	let mode = p.condMode || 0
	let start = p.condStart || 0
	if (isLapCondMode(mode))
		return clampCondIndex(start) + 1
	return clampCondIndex(start)
}

function getCondDisplayEnd(p)
{
	let mode = p.condMode || 0
	let end = p.condEnd || 0
	if (isLapCondMode(mode))
		return clampCondIndex(end) + 1
	return clampCondIndex(end)
}

function condDisplayToRaw(mode, value)
{
	if (isLapCondMode(mode))
		return clampCondIndex(value - 1)
	return clampCondIndex(value)
}

function describeConditional(p)
{
	let mode = p.condMode || 0
	if (mode == 0)
		return "<strong>Conditional State:</strong> Disabled"

	let start = clampCondIndex(p.condStart || 0)
	let end = clampCondIndex(p.condEnd || 0)
	
	if (isLapCondMode(mode))
	{
		start += 1
		end += 1
	}

	if (isLapProgressCondMode(mode))
	{
		let startPercent = getCondProgressStartPercent(p)
		let endPercent = getCondProgressEndPercent(p)
		let startValue = clampCondIndex(p.condStart || 0) * 100 + startPercent
		let endValue = clampCondIndex(p.condEnd || 0) * 100 + endPercent
		let wraps = startValue > endValue ? " (wrap-around)" : ""
		let rangeText = "lap " + start + " @ " + startPercent + "% to lap " + end + " @ " + endPercent + "%"
		if (isInvertedCondMode(mode))
			return "<strong>Conditional State:</strong> OFF in " + rangeText + wraps + ", ON elsewhere"
		return "<strong>Conditional State:</strong> ON in " + rangeText + wraps + ", OFF elsewhere"
	}

	let targetName = isLapCondMode(mode) ? "laps" : "checkpoint regions"
	let wraps = (p.condStart || 0) > (p.condEnd || 0) ? " (wrap-around)" : ""
	if (isInvertedCondMode(mode))
		return "<strong>Conditional State:</strong> OFF in " + targetName + " " + start + " to " + end + wraps + ", ON elsewhere"
	return "<strong>Conditional State:</strong> ON in " + targetName + " " + start + " to " + end + wraps + ", OFF elsewhere"
}

function getCheckpointCompletion(point, maxLayer)
{
	if (point == null || point.pathLen == null || point.pathLen <= 0 || point.pathPointIndex == null || point.pathLayer == null || maxLayer < 0)
		return null

	let groupCompletion = point.pathPointIndex / point.pathLen
	let overallCompletion = (groupCompletion + point.pathLayer) / (maxLayer + 1)
	return isFinite(overallCompletion) ? overallCompletion : null
}

function getCheckpointCenter(point)
{
	return point.pos[0].add(point.pos[1]).scale(0.5)
}

function projectPointOntoSegment2D(point, start, end)
{
	let dx = end.x - start.x
	let dy = end.y - start.y
	let lenSq = dx * dx + dy * dy
	if (lenSq <= 0)
	{
		let offsetX = point.x - start.x
		let offsetY = point.y - start.y
		return { t: 0, distSq: offsetX * offsetX + offsetY * offsetY }
	}

	let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq
	t = Math.max(0, Math.min(1, t))

	let projX = start.x + dx * t
	let projY = start.y + dy * t
	let distX = point.x - projX
	let distY = point.y - projY

	return { t, distSq: distX * distX + distY * distY }
}

function normalizeProgress(progress)
{
	if (!isFinite(progress))
		return null

	let wrapped = progress % 1
	if (wrapped < 0)
		wrapped += 1
	return wrapped
}

function getLapProgressPercentForObject(data, objectPoint)
{
	if (objectPoint == null || objectPoint.pos == null || data == null || data.checkpointPoints == null)
		return null

	let checkpointPoints = data.checkpointPoints.nodes
	if (checkpointPoints == null || checkpointPoints.length == 0)
		return null

	let maxLayer = data.checkpointPoints.maxLayer
	if (!isFinite(maxLayer) || maxLayer < 0)
	{
		maxLayer = -1
		for (let point of checkpointPoints)
		{
			if (point.pathLayer != null && isFinite(point.pathLayer))
				maxLayer = Math.max(maxLayer, point.pathLayer)
		}
	}
	if (maxLayer < 0)
		return null

	let bestDistSq = Infinity
	let bestProgress = null

	for (let point of checkpointPoints)
	{
		let pointCompletion = getCheckpointCompletion(point, maxLayer)
		if (pointCompletion == null)
			continue

		let pointCenter = getCheckpointCenter(point)
		if (!pointCenter.isFinite())
			continue

		let hasSegment = false

		for (let next of point.next)
		{
			if (next == null || next.node == null)
				continue

			let nextCompletion = getCheckpointCompletion(next.node, maxLayer)
			if (nextCompletion == null)
				continue

			let nextCenter = getCheckpointCenter(next.node)
			if (!nextCenter.isFinite())
				continue

			let projection = projectPointOntoSegment2D(objectPoint.pos, pointCenter, nextCenter)
			let segmentStart = pointCompletion
			let segmentEnd = nextCompletion
			if (segmentEnd < segmentStart)
				segmentEnd += 1

			let progress = normalizeProgress(segmentStart + (segmentEnd - segmentStart) * projection.t)
			if (progress != null && projection.distSq < bestDistSq)
			{
				bestDistSq = projection.distSq
				bestProgress = progress
			}

			hasSegment = true
		}

		if (hasSegment)
			continue

		let distX = objectPoint.pos.x - pointCenter.x
		let distY = objectPoint.pos.y - pointCenter.y
		let distSq = distX * distX + distY * distY
		let progress = normalizeProgress(pointCompletion)
		if (progress != null && distSq < bestDistSq)
		{
			bestDistSq = distSq
			bestProgress = progress
		}
	}

	return bestProgress != null ? bestProgress * 100 : null
}


class ViewerObjects extends PointViewer
{
	constructor(window, viewer, data)
	{
		super(window, viewer, data)
		this.interCloneCount = 3
	}
	
	
	points()
	{
		return this.data.objects
	}
	
	
	refreshPanels()
	{
		let panel = this.window.addPanel("Objects", false, (open) => { if (open) this.viewer.setSubviewer(this) })
		this.panel = panel
		
		panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Object")
		panel.addText(null, "<strong>Hold Alt + Drag Object:</strong> Duplicate Object")
		panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect")
		
		panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x)
		panel.addCheckbox(null, "Use signed settings (-32768...32767)", this.viewer.cfg.objectsEnableSignedSettings, (x) => { this.viewer.cfg.objectsEnableSignedSettings = x; this.refreshPanels(); })
		panel.addSpacer(null)

		panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection())
		panel.addButton(null, "(T) Select All With Same ID", () => this.toggleAllSelectionByID())
		panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints())
		panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY())
		panel.addSpacer(null)
		panel.addButton(null, "Add Duplicates Between 2 Selected", () => this.interClone(this.interCloneCount))
		panel.addSelectionNumericInput(null, "Dupe Count", 1, 100, this.interCloneCount, 1, 1, true, false, (x) => { this.interCloneCount = x })

		panel.addSpacer(null, 2)
		
		panel.addButton(null, "Open Object Database", () => this.window.openExternalLink("https://szs.wiimm.de/cgi/mkw/object"))
		panel.addSpacer(null)

		let selectedPoints = this.data.objects.nodes.filter(p => p.selected)
		
		let selectionGroup = panel.addGroup(null, "Selection:")
		let enabled = (selectedPoints.length > 0)
		let multiedit = (selectedPoints.length > 1)

		if (selectedPoints.length == 1)
		{
			let i = this.data.objects.nodes.findIndex(p => p === selectedPoints[0])
			panel.addText(selectionGroup, "<strong>GOBJ Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")")

			let lapProgress = getLapProgressPercentForObject(this.data, selectedPoints[0])
			panel.addText(selectionGroup, "<strong>Lap Progress:</strong> " + (lapProgress != null ? (lapProgress.toFixed(4).toString() + "%") : "N/A"))
		}
		
		let objName = panel.addText(selectionGroup, "<strong>Name:</strong> " + (selectedPoints.length > 0 ? objectNames[selectedPoints[0].id] : ""))
		panel.addSelectionNumericInput(selectionGroup,      "ID",        0,  0xffff, selectedPoints.map(p =>  p.id),           1.0, 1.0, enabled, multiedit, (x, i) => {
			this.window.setNotSaved()
			selectedPoints[i].id = x
			objName.innerHTML = "<strong>Name:</strong> " + objectNames[x]
		})
		
		panel.addSelectionNumericInput(selectionGroup,       "X", -1000000, 1000000, selectedPoints.map(p =>  p.pos.x),       null, 100.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].pos.x = x })
		panel.addSelectionNumericInput(selectionGroup,       "Y", -1000000, 1000000, selectedPoints.map(p => -p.pos.z),       null, 100.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].pos.z = -x })
		panel.addSelectionNumericInput(selectionGroup,       "Z", -1000000, 1000000, selectedPoints.map(p => -p.pos.y),       null, 100.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].pos.y = -x })
		panel.addSelectionNumericInput(selectionGroup,  "Rot. X", -1000000, 1000000, selectedPoints.map(p =>  p.rotation.x),  null, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].rotation.x = x % 360 }, x => { return x % 360 })
		panel.addSelectionNumericInput(selectionGroup,  "Rot. Y", -1000000, 1000000, selectedPoints.map(p =>  p.rotation.y),  null, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].rotation.y = x % 360 }, x => { return x % 360 })
		panel.addSelectionNumericInput(selectionGroup,  "Rot. Z", -1000000, 1000000, selectedPoints.map(p =>  p.rotation.z),  null, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].rotation.z = x % 360 }, x => { return x % 360 })
		panel.addSelectionNumericInput(selectionGroup, "Scale X", -1000000, 1000000, selectedPoints.map(p =>  p.scale.x),     null, 0.1, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].scale.x = x })
		panel.addSelectionNumericInput(selectionGroup, "Scale Y", -1000000, 1000000, selectedPoints.map(p =>  p.scale.z),     null, 0.1, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].scale.z = x })
		panel.addSelectionNumericInput(selectionGroup, "Scale Z", -1000000, 1000000, selectedPoints.map(p =>  p.scale.y),     null, 0.1, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].scale.y = x })
		
		let routeOptions = [{ str: "None", value: 0xffff }]
		for (let i = 0; i < this.data.routes.length; i++)
			routeOptions.push({ str: "Route " + i + " (0x" + i.toString(16) + ")", value: i })
		panel.addSelectionDropdown(selectionGroup, "Route", selectedPoints.map(p => p.routeIndex), routeOptions, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].routeIndex = x })
		
		for (let s = 0; s < 8; s++)
			if (this.viewer.cfg.objectsEnableSignedSettings)
				panel.addSelectionNumericInput(selectionGroup, "Setting " + (s + 1), -0x8000, 0x7fff, selectedPoints.map(p => p.settings[s] >= 0x8000 ? p.settings[s] - 0x10000 : p.settings[s]), 1.0, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].settings[s] = (x < 0 ? 0x10000 + x : x) })
			else
				panel.addSelectionNumericInput(selectionGroup, "Setting " + (s + 1), 0, 0xffff, selectedPoints.map(p => p.settings[s]), 1.0, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].settings[s] = x })

		if (this.viewer.cfg.enableRrFeatures)
		{
			panel.addSpacer(selectionGroup)
			panel.addText(selectionGroup, "<strong>Conditional Objects (Presence Flags bits 3-11, Padding for Lap Progress %):</strong>")
			panel.addSelectionDropdown(selectionGroup, "Cond. Mode", selectedPoints.map(p => p.condMode || 0), conditionalModeOptions, enabled, multiedit, (x, i) => {
				this.window.setNotSaved()
				selectedPoints[i].condMode = x
			})
			panel.addSelectionNumericInput(selectionGroup, "Cond. Start", 0, 8, selectedPoints.map(p => getCondDisplayStart(p)), 1.0, 1.0, enabled, multiedit, (x, i) => {
				this.window.setNotSaved()
				let mode = selectedPoints[i].condMode || 0
				if (mode == 0) { selectedPoints[i].condMode = 1; mode = 1 }
				selectedPoints[i].condStart = condDisplayToRaw(mode, x)
			})
			panel.addSelectionNumericInput(selectionGroup, "Cond. End", 0, 8, selectedPoints.map(p => getCondDisplayEnd(p)), 1.0, 1.0, enabled, multiedit, (x, i) => {
				this.window.setNotSaved()
				let mode = selectedPoints[i].condMode || 0
				if (mode == 0) { selectedPoints[i].condMode = 1; mode = 1 }
				selectedPoints[i].condEnd = condDisplayToRaw(mode, x)
			})
			panel.addSelectionNumericInput(selectionGroup, "Cond. Start %", 0, 100, selectedPoints.map(p => getCondProgressStartPercent(p)), 1.0, 1.0, enabled, multiedit, (x, i) => {
				this.window.setNotSaved()
				let mode = selectedPoints[i].condMode || 0
				if (!isLapProgressCondMode(mode))
					selectedPoints[i].condMode = 5
				setCondProgressStartPercent(selectedPoints[i], x)
			})
			panel.addSelectionNumericInput(selectionGroup, "Cond. End %", 0, 100, selectedPoints.map(p => getCondProgressEndPercent(p)), 1.0, 1.0, enabled, multiedit, (x, i) => {
				this.window.setNotSaved()
				let mode = selectedPoints[i].condMode || 0
				if (!isLapProgressCondMode(mode))
					selectedPoints[i].condMode = 5
				setCondProgressEndPercent(selectedPoints[i], x)
			})
			if (enabled && selectedPoints.length > 0)
			{
				let first = selectedPoints[0]
				let allSame = selectedPoints.every(p => (p.condMode || 0) === (first.condMode || 0) && (p.condStart || 0) === (first.condStart || 0) && (p.condEnd || 0) === (first.condEnd || 0))
				if (allSame && isLapProgressCondMode(first.condMode || 0))
					allSame = selectedPoints.every(p => getCondProgressStartPercent(p) === getCondProgressStartPercent(first) && getCondProgressEndPercent(p) === getCondProgressEndPercent(first))
				if (allSame)
					panel.addText(selectionGroup, describeConditional(first))
				else
					panel.addText(selectionGroup, "<strong>Conditional State:</strong> Multiple selected objects have different conditional values")
			}
		}

		panel.addSpacer(selectionGroup)
		panel.addSelectionNumericInput(selectionGroup, "Padding", 0, 0xffff, selectedPoints.map(p => p.xpfThing ?? 0), 1.0, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].xpfThing = x })
		
		panel.addSelectionNumericInput(selectionGroup, "Presence", 0, 0x7, selectedPoints.map(p => p.presence & 0x7), 1.0, 1.0, enabled, multiedit, (x, i) => { this.window.setNotSaved(); selectedPoints[i].presence = x & 0x7 })
	}
	
	
	refresh()
	{
		super.refresh()
		this.refreshPanels()
	}
	
	
	toggleAllSelectionByID()
	{
		let selectedObjs = this.data.objects.nodes.filter(p => p.selected)
		
		for (let point of this.data.objects.nodes)
			point.selected = (selectedObjs.find(p => p.id == point.id) != null)
		
		this.refreshPanels()
	}

	interClone(count) {
		let selectedObjs = this.data.objects.nodes.filter(p => p.selected)

		if (selectedObjs.length !== 2)
			return

		if (this.points().nodes.length + count > this.points().maxNodes)
		{
			alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")")
			return
		}

		let newPoints = []
		for (let i = 0; i < count; i++)
		{
			newPoints.push(this.points().addNode())
			this.points().onCloneNode(newPoints[i], selectedObjs[0])
			newPoints[i].pos.x = (selectedObjs[0].pos.x * (i+1) + selectedObjs[1].pos.x * (count-i)) / (count+1)
			newPoints[i].pos.y = (selectedObjs[0].pos.y * (i+1) + selectedObjs[1].pos.y * (count-i)) / (count+1)
			newPoints[i].pos.z = (selectedObjs[0].pos.z * (i+1) + selectedObjs[1].pos.z * (count-i)) / (count+1)
			newPoints[i].selected = true
		}

		this.refresh()
		this.refreshPanels()
		this.window.setNotSaved()
	}
	
	
	onKeyDown(ev)
	{
		if (super.onKeyDown(ev))
			return true
		
		switch (ev.key)
		{
			case "T":
			case "t":
				this.toggleAllSelectionByID()
				return true
		}
		
		return false
	}
	
	
	drawAfterModel()
	{
		for (let point of this.data.objects.nodes)
		{
			let pointHidden = this.isPointHidden(point)
			let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos)
			
			point.renderer
				.setTranslation(point.pos)
				.setScaling(new Vec3(scale, scale, scale))
				.setDiffuseColor([1, 0, 1, 1])
				.setEnabled(!pointHidden)
				
			point.rendererSelected
				.setTranslation(point.pos)
				.setScaling(new Vec3(scale, scale, scale))
				.setDiffuseColor([1, 0.5, 1, 1])
				.setEnabled(!pointHidden && point.selected)
				
			point.rendererSelectedCore
				.setDiffuseColor([1, 0, 1, 1])
				
			let matrixDirection =
				Mat4.scale(scale, scale / 1.5, scale / 1.5)
				.mul(Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180))
				.mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180))
				.mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180))
				.mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180))
				.mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z))
				
			point.rendererDirection
				.setCustomMatrix(matrixDirection)
				.setDiffuseColor([1, 0.5, 1, 1])
				.setEnabled(!pointHidden && this.viewer.cfg.enableRotationRender)
				
			point.rendererDirectionArrow
				.setCustomMatrix(matrixDirection)
				.setDiffuseColor([1, 0.35, 1, 1])
				.setEnabled(!pointHidden && this.viewer.cfg.enableRotationRender)
				
			point.rendererDirectionUp
				.setCustomMatrix(matrixDirection)
				.setDiffuseColor([0.75, 0, 0.75, 1])
				.setEnabled(!pointHidden && this.viewer.cfg.enableRotationRender)
		}
		
		this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera())
		this.sceneAfter.clearDepth(this.viewer.gl)
		this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera())
	}
}


if (module)
	module.exports = { ViewerObjects }

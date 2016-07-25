import {messageFast, messageSlow, messageWarnings} from './processCanData'

function messageSelect(pCanId, pCanDataArray) {

	if (pCanId == 0x101) {
		return messageFast(pCanDataArray)
	} else if (pCanId == 0x102) {
		return messageSlow(pCanDataArray)
	} else if (pCanId == 0x200) {
		return messageWarnings(pCanDataArray)
	} else return {}
}

module.exports = function processCanMessage (pCanMessage) {
	const reParseCanString = /([0-9]+)\:([0-9]+)\,([0-9]+)\,([0-9]+)\,([0-9]+)\,([0-9]+)\,([0-9]+)\,([0-9]+)\,?([0-9]+)?/g
	const match = reParseCanString.exec(pCanMessage)
	let dataArray = []

	if (match) {
		const canId = match[1]

		if (isNaN(match[10])) {
			dataArray = match.splice(2, 9)
			dataArray[7] = 0
		} else {
			dataArray = match.splice(2, 10)
		}

		return messageSelect(canId, dataArray)
	}
}

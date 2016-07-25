//Currently not in infotainment CAN messages:
//'engineTorque' : engineTorque,

const messageFast = (pCanDataArray) => {

	const time = Date.now()
	const engineThrottlePercent = pCanDataArray[0]>>1
	const motorThrottlePercent = pCanDataArray[1]>>1
	const engineRpm = parseInt(pCanDataArray[3])*256+parseInt(pCanDataArray[2])
	const vehicleSpeed = pCanDataArray[4]>>1
	const essSoc = pCanDataArray[5]>>1
	const currentGear = pCanDataArray[6]&0xF

	return [
		{
			time,
			'engineRpm': parseInt(engineRpm)
		},
		{
			time,
			vehicleSpeed
		},
		{
			time,
			essSoc
		},
		{
			time,
			currentGear
		}
	]
}

const messageSlow = (pCanDataArray) => {

	const time = Date.now()
	const vehicleDistance = pCanDataArray[1]*256+pCanDataArray[0]
	const throttlePercent = pCanDataArray[2]>>1
	const brakePercent = pCanDataArray[3]>>1
	const fuel = pCanDataArray[4]>>1
	const GLV_cockpit_BRB = pCanDataArray[5]&0x1
	const GLV_TSMS = (pCanDataArray[5]>>1)&0x1
	const Control_Mode = (pCanDataArray[5]>>2)&0x3
	const engineTemp = pCanDataArray[6]

	return [
		{
			time,
			throttlePercent
		},
		{
			time,
			fuel
		},
		{
			time,
			'engineTemp' : parseInt(engineTemp)
		}
	]
}

const messageWarnings = (pCanDataArray)  => {

	const time = Date.now()
	const fuel_level_low = (pCanDataArray[0]>>1)&0x1
	const glv_soc_low = (pCanDataArray[0]>>3)&0x1
	const ess_over_temp = (pCanDataArray[0]>>4)&0x1
	const transmission_failure = (pCanDataArray[0]>>5)&0x1
	
	return [
		{
			time,
			fuel_level_low
		},
		{
			time,
			glv_soc_low
		},
		{
			time,
			ess_over_temp
		},
		{
			time,
			transmission_failure
		}
	]
}

module.export = {
	messageFast,
	messageSlow,
	messageWarnings
}

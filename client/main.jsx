import React from 'react'
import {render}  from 'react-dom'
import UVicHybridTelemetry from './components/UVicHybridTelemetry'
import viewconfig from 'viewconfig.json'
import './main.scss'

render (
	<UVicHybridTelemetry layout={viewconfig}/>,
	document.getElementById('app')
)

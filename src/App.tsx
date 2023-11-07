import React from 'react'
import { useState } from 'react'
import DATA from './data.json'
import { Typography } from '@mui/material'
import { Chiller } from './components/commonInterfaces'
import { EnvelopePlots } from './components/EnvelopePlots'
import { ChillerList } from './components/ChillerList'

const App = () => {
  const [chillerData, setChillerData] = useState<Chiller[]>(DATA)


  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <Typography variant={'h4'}>
          Heatpumps
        </Typography>
      </header>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
        <div style={{ flex: 1 }}>
          <ChillerList chillerData={chillerData} />
        </div>
        <div style={{ flex: 5, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <EnvelopePlots chillerData={chillerData} setChillerData={setChillerData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

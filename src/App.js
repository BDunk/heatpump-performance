import { useState } from 'react'
import { DATA, x_data, y_data } from './data.js'
import Plot from 'react-plotly.js'

function App() {

  const [point, setPoint] = useState([[], []]);
  const [chillerData, setChillerData] = useState(DATA)

  const chillerTraces = chillerData.filter((chiller) => {
    return chiller.active
  }).map((chiller) => {
    return {
      x: chiller['data']['x'],
      y: chiller['data']['y'],
      fill: 'toself',
      fillcolor: 'rgba(255,0,0,0.5)',
      hoveron: 'fills',
      line: {
        color: '#ab63fa'
      },
      text: "Points + Fills",
      hoverinfo: 'text',
      name: chiller['name']
    }
  })

  const chillerWords =

    console.log(chillerTraces)

  const handleClick = event => {
    const point = event.points[0];
    console.log([point.x, point.y])
    setPoint([[point.x], [point.y]])
  }

  return (
    <div>
      <header>
        Heatpump Performance
      </header>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          List of options
          {chillerData.filter((chiller) => {
            return chiller.active
          }).map((chiller) => {
            return (
              <div>
                {chiller.name}
              </div>
            )
          })}
        </div>
        <div style={{ flex: 3 }}>
          <Plot
            data={[
              ...chillerTraces,
              {
                x: x_data,
                y: y_data,
                type: 'scatter',
                hoverinfo: 'text',
                mode: 'none',
                showlegend: false
              },
              {
                x: point[0],
                y: point[1],
                type: 'scatter',
                hoverinfo: 'text',
                mode: 'points',
                showlegend: false
              }
            ]}
            layout={{
              xaxis: {
                range: [70, 150]
              },
              yaxis: {
                range: [-30, 120]
              }
            }}
            onClick={handleClick}
          />
        </div>
      </div>


    </div>
  );
}

export default App;

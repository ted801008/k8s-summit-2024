import { readFileSync } from "fs"
import path from "path"
import exporter from "highcharts-export-server"

const version = '11.3.0';
const config = {
  puppeteer: {
    args: [],
  },
  highcharts: {
    version,
    cdnURL: "http://localhost:7801/cdn/",
    forceFetch: true,
    coreScripts: ["highcharts"],
    modules: [
      "parallel-coordinates",
      "data",
      "static-scale",
      "broken-axis",
      "item-series",
      "pattern-fill",
      "series-label",
      "no-data-to-display",
    ],
    indicators: [],
    scripts: [],
  },
  export: {
    // your export options
  },
  customCode: {
    allowCodeExecution: false,
    allowFileResources: true,
    customCode: false,
    callback: false,
    resources: false,
    loadConfig: false,
    createConfig: false,
  },
  server: {
    enable: true
    // ... server config
  },
  pool: {
   // ... pool config
  },
  logging: {
    level: 2,
    file: "highcharts-export-server.log",
    dest: "log/",
  },
  ui: {
    enable: true,
    route: "/",
  },
  other: {
    noLogo: true,
  },
}

const main = async () => {

  exporter.server.get(new RegExp(`^/cdn(?:/[^/]+)?/${version}/(.+)$`), (req, res) => {
    const filePath = path.join(
      path.resolve(),
      "node_modules/highcharts/",
      req.params[0]
    )
  
    res.status(200).send(readFileSync(filePath))
  })

  const exportOptions = exporter.setOptions(config, [])

  // we have to start the server before we initialize the pool
  // otherwise the local CDN endpoint isn't available 
  await exporter.startServer(exportOptions.server)

  // Must initialize exporting before being able to export charts
  await exporter.initExport(exportOptions);
}

void main()
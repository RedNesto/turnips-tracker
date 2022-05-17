import React from "react";
import {Chart} from "chart.js";

import {createProfitChartData, createTurnipsNumberChartData, normalizeTurnipsEntry, sortTurnipsEntries, TurnipsEntry} from "./Turnips";

import TurnipsTable from './TurnipsTable'
import EntryEditor from './TurnipsEntryEditor'

type LoadTurnipsDataProps = {
    tableRef: React.RefObject<TurnipsTable>
    priceChartContainerRef: React.RefObject<HTMLDivElement>
    priceChartRef: React.RefObject<Chart<"line">>
    profitChartContainerRef: React.RefObject<HTMLDivElement>
    profitChartRef: React.RefObject<Chart<"line">>
    entryEditorRef: React.RefObject<EntryEditor>
}

export default class LoadTurnipsData extends React.Component<LoadTurnipsDataProps, {}> {
    private turnipsFileInputRef = React.createRef<HTMLInputElement>()
    private downloadDataFakeLinkRef = React.createRef<HTMLAnchorElement>()

    render() {
        return (
            <form>
                <button onClick={this.createNewData}>New Turnips Data</button>
                <button onClick={this.openDataFileSelection}>Select Turnips Data</button>
                <input type="file" id="turnips-file" onChange={this.handleChange}
                       style={{width: 0, height: 0}} ref={this.turnipsFileInputRef} hidden/>
                <button onClick={this.downloadData}>Save Turnips Data</button>
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/anchor-is-valid */}
                <a download="turnips-data.json" style={{width: 0, height: 0}} ref={this.downloadDataFakeLinkRef} hidden/>
                <button onClick={this.useSample}>Open Sample</button>
                <button onClick={this.clearData}>Clear</button>
            </form>
        )
    }

    createNewData = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        this.props.entryEditorRef.current!.setState({hidden: false})
    }

    clearData = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        this.props.priceChartContainerRef.current!.style.setProperty('display', 'none')
        this.props.profitChartContainerRef.current!.style.setProperty('display', 'none')
        this.props.tableRef.current!.setState({entries: []})
        this.props.entryEditorRef.current!.setState({hidden: true})
    }

    useSample = (event: React.SyntheticEvent) => {
        event.preventDefault()
        fetch("/turnips-tracker/sample.json")
            .then(response => {
                if (!response.ok) {
                    this.reportError(`Could not get sample data: ${response.status} ${response.statusText}`)
                    return
                }

                return response.text()
            }).then((text: string | undefined) => this.parseAndOpenJson(text as string))
    }

    openDataFileSelection = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const fileInput = this.turnipsFileInputRef.current!
        // Reset the input's value so we can select the same file twice in a row
        fileInput.value = ''
        fileInput.click()
    }

    downloadData = (event: React.SyntheticEvent) => {
        event.preventDefault()
        const entries = this.props.tableRef.current!.state.entries.sort(sortTurnipsEntries);
        const prettifiedJson = JSON.stringify(entries, null, 2);
        const uriFriendlyData = encodeURIComponent(prettifiedJson);

        const fakeLinkElement = this.downloadDataFakeLinkRef.current!;
        fakeLinkElement.setAttribute('href', 'data:text/plain;charset:utf-8,' + uriFriendlyData)
        fakeLinkElement.click()
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const turnipsFile = event.target?.files?.item(0)
        if (!turnipsFile) {
            return
        }
        if (!(turnipsFile instanceof Blob)) {
            console.log("Not a Blob, but a %s", typeof turnipsFile)
            return
        }
        this.openAndParseJsonFile(turnipsFile)
    }

    openAndParseJsonFile = (turnipsFile: Blob) => {
        const reader = new FileReader()
        const turnipsTable = this.props.tableRef.current!
        reader.onload = _ => {
            const text = reader.result
            console.assert(typeof text === "string", "readAsText did not return a String result but a %s of value %s", text?.constructor.name, text)
            this.parseAndOpenJson(text as string)
        }
        reader.onerror = _ => {
            const error = reader.error
            console.error("Error occurred when reading turnips data file: %s", error)
            turnipsTable.setState({errorMessage: `could not read file: ${error?.message}`})
        }
        reader.readAsText(turnipsFile)
    }

    parseAndOpenJson = (text: string) => {
        try {
            const parsed = JSON.parse(text)
            this.openJson(parsed)
        } catch (error) {
            console.error("Error occurred when opening turnips data: %s", error)
            let errorMessage = "more details in the console"
            if (error instanceof Error) {
                errorMessage = error.message
            }
            this.reportError(errorMessage)
        }
    }

    openJson = (entries: TurnipsEntry[]) => {
        let normalizedEntries = entries.map(normalizeTurnipsEntry);
        this.props.tableRef.current!.setState({entries: normalizedEntries})
        const turnipsPriceChart = this.props.priceChartRef.current!
        turnipsPriceChart.data = createTurnipsNumberChartData(normalizedEntries)
        turnipsPriceChart.update()
        this.props.priceChartContainerRef.current!.style.removeProperty('display')
        const turnipsProfitChart = this.props.profitChartRef.current!
        turnipsProfitChart.data = createProfitChartData(normalizedEntries)
        turnipsProfitChart.update()
        this.props.profitChartContainerRef.current!.style.removeProperty('display')

        this.clearError()
    }

    reportError = (errorMessage: string) => this.props.tableRef.current!.setState({errorMessage: errorMessage})

    clearError = () => this.props.tableRef.current!.setState({errorMessage: undefined})
}

import React, { Component } from 'react'
import {Table, Button, Collapse, OverlayTrigger, Tooltip, Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

class Workbench extends Component {

    constructor(...args) {
        super(...args);

        var collapse_rows = new Array(this.props.data.length).fill(false)
        this.state = { 
            collapse_rows: collapse_rows,
            show_configuration_modal : false,
            data : [
                {
                    id: 1,
                   	methodNames : ["ma1", "ma2", "ma2", "ma2"],
                   	recall : [0.1, 0.2, 0.2, 0.2],
                   	fmeasure: [0.1, 0.2, 0.2, 0.2],
                   	precision: [0.1, 0.2, 0.2, 0.2],
                   	time :[0.1, 0.2, 0.2, 0.2],
                   	clusters: 202,
                   	inputInstances: 202
                },
                {
                    id: 1,
                   	methodNames : ["ma1", "ma2", "ma2", "ma2"],
                   	recall : [0.1, 0.2, 0.2, 0.2],
                   	fmeasure: [0.1, 0.2, 0.2, 0.2],
                   	precision: [0.1, 0.2, 0.2, 0.2],
                   	time :[0.1, 0.2, 0.2, 0.2],
                   	clusters: 202,
                   	inputInstances: 202
                }
            ]
        }
        
      this.setData()
    }

    componentDidMount = () => this.setData()
    componentDidUpdate = () => this.setData()

    setData = () => {
        if (this.props.data.length != this.state.data.length) {
            var collapse_rows = new Array(this.props.data.length).fill(false)
            this.setState({
                data: this.props.data,
                collapse_rows: collapse_rows
            })
        }
    }

    deleteWorkflow = (e, id) => {
        axios
            .get("/workflow/workbench/delete/" + id)
            .then(res => { 
                console.log(res)
                this.props.getDataFunc()
                this.setData()
            })
    }

    close_configuration_modal = () => this.setState({show_configuration_modal : false});
    open_configuration_modal = () => this.setState({show_configuration_modal : true});

    previewWorkflow = (e, id) => {

        var wf_data = null
        axios
            .get("/workflow/workbench/get_configurations/" + id)
            .then(res => {
                wf_data = res.data
                console.log(wf_data)
            })
        
        this.open_configuration_modal()
    }

    collapseRows = (e, indexName) => {
        
        var collapse_rows = this.state.collapse_rows
        collapse_rows[indexName] = !collapse_rows[indexName]

        var elements = document.getElementsByName(indexName)
        if (collapse_rows[indexName]) 
            elements.forEach(x => x.style.display = "")
        else 
            elements.forEach(x => x.style.display = "none")

        this.setState({collapse_rows: collapse_rows})
        
    }

    formInnerTable = (d, ar_length, index) => {
        const rows = []
        var row = 
                <tr key={0}>
                    <td>
                        <Button variant="light" size="sm" onClick={e => this.collapseRows(e, index)}>
                            <span className="fa fa-bars"/>
                        </Button>
                    </td>
                    <td>{d.methodNames[0]}</td>
                    <td>{parseFloat(d.recall[0]).toFixed(2)}</td>
                    <td>{parseFloat(d.fmeasure[0]).toFixed(2)}</td>
                    <td>{parseFloat(d.precision[0]).toFixed(2)}</td>
                    <td> {parseFloat(d.time[0]).toFixed(2)}</td>
                </tr>
        rows.push(row)
 
        var i = 1 
        for (i = 1; i < ar_length; i++){
            row =  
                <tr key={i} name={index} style={{display:"none"}}>
                    <td/>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{d.methodNames[i]}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{parseFloat(d.recall[i]).toFixed(2)}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{parseFloat(d.fmeasure[i]).toFixed(2)}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{parseFloat(d.precision[i]).toFixed(2)}</div>
                        </Collapse>
                    </td>
                    <td>
                        <Collapse in={this.state.collapse_rows[index]} >
                            <div>{parseFloat(d.time[i]).toFixed(2)}</div>
                        </Collapse>
                    </td>
                </tr>
            rows.push(row)
        }

        var table =
            <Table striped bordered size="sm" >
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}} >Method</th>
                        <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Recall</th>
                        <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>F1 Measure</th>
                        <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Precision</th>
                        <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Time</th>
                    </tr>                        
                </thead>
                <tbody>
                   {rows}
                </tbody>
            </Table>

        return table

    }


    formTable = () =>{
       
        const rows = []
        this.state.data.forEach( (d, index) => {
            var inner_table = this.formInnerTable(d, d.methodNames.length, index)
            var row =
                <tr key={index}>
                    <td style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>{d.workflowID}</td>
                    <td style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>{inner_table}</td>
                    <td style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>{d.inputInstances}</td>
                    <td style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>{d.clusters}</td>
                    <td style={{textAlign:"center", verticalAlign:"middle"}} size="sm">
                        <div style={{display: "inline-block"}}>

                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id='tooltip-top' >
                                        Delete
                                    </Tooltip>}
                                >
                                <Button style={{marginRight:"5px", float:"left"}} variant="danger" size="sm" onClick={e => this.deleteWorkflow(e, d.id)} >
                                    <span  className="fa fa-trash"/>
                                </Button>
                            </OverlayTrigger>
                            
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id='tooltip-top' >
                                        Preview
                                    </Tooltip>}
                            >
                                <Button style={{marginRight:"5px", float:"center"}} variant="info" size="sm" onClick={e => this.previewWorkflow(e, d.id)}>
                                    <span className="fa fa-eye"/>
                                </Button>
                            </OverlayTrigger>
                            
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id='tooltip-top' >
                                        Execute
                                    </Tooltip>}
                            >
                                <Button style={{marginRight:"5px", float:"right"}} variant="primary" size="sm" >
                                    <span className="fa fa-play-circle"/>
                                </Button>
                            </OverlayTrigger>
                        </div>
                    </td>
                </tr>   
            rows.push(row)
        })
        var table = 
                <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>ID</th>
                            <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Performance</th>
                            <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Input Instancies</th>
                            <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Clusters</th>   
                            <th style={{textAlign:"center", verticalAlign:"middle", margin:"auto"}}>Actions</th>                           
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
    
        return table
    }



    render() {

        var table = this.formTable()

        return (
            <div>

                <Modal show={this.state.show_configuration_modal} onHide={this.close_configuration_modal} size="xl">
                    <Modal.Header closeButton>
                    <Modal.Title>Configurations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                    Configurations Modal
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.close_configuration_modal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>


                {table}
            </div>
        )
    }
}


Workbench.propTypes = {
    data: PropTypes.array.isRequired,
    getDataFunc: PropTypes.func.isRequired
}


export default Workbench
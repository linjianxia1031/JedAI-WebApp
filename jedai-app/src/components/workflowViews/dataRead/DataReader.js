import React, { Component } from 'react'
import {Form, Col, Row} from 'react-bootstrap/'
import 'react-dropdown/style.css'
import ProfileReader from './ProfileReader';
import AlertModal from '../utilities/AlertModal'



 class DataReader extends Component {

    constructor(...args) {
        super(...args);
        
        this.collapse_conf = false;
        this.collapse_explore = false;
        this.dataIsSet = false;
        this.setEntity = this.setEntity.bind(this)

        this.alertText = "Select an ER Mode"


        this.state = { 
            er_mode : "",
            entity1_set : false,
            entity2_set : false,
            groundTruth_set : false,
            alertShow : false

        }
    }

    // Set er_mode and based on that it disables the second profileReader
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === "er_mode")
            if(e.target.value === "dirty") {
                this.alertText = "Entity profile D1 and Ground-truth must be set!"
                this.setState({entity2_set: true})
            }
            else {
                this.alertText = "Entity profile D1, Entity profile D2 and Ground-truth must be set!"
                this.setState({entity2_set: false})
            }
    }        

    //Check which entities have been completed successfully
    setEntity = (entity_id, isSet) => {
        switch(entity_id) {
            case "1":
                this.setState({entity1_set: isSet})
                break;
            case "2":
                this.setState({entity2_set: isSet})
                break;
            case "3":
                this.setState({groundTruth_set: isSet})
                break;
            default:
                console.log("ERROR")

          }
    }

    handleAlertClose = () => this.setState({alertShow : false});
    handleAlerShow = () => this.setState({alertShow : true});


    isValidated(){
        var isSet = this.state.entity1_set && this.state.entity2_set && this.state.groundTruth_set
        if (isSet)
            return true
        else{
            
            this.handleAlerShow()
            return false
        }

    }

    render() {
        
        return ( 
            
            <div >
                <AlertModal text={this.alertText} show={this.state.alertShow} handleClose={this.handleAlertClose} />
                <br/>
                <div style={{marginBottom:"5px"}}> 
                    <h1 style={{display:'inline', marginRight:"20px"}}>Data Reading</h1> 
                    <span className="workflow-desc">  Data Reading transforms the input data into a list of entity profiles.</span>
                </div>
                <br/>
                
                    <Form.Row className="form-row">
                        <h5 >Select files for the entity profiles and ground-truth</h5>  
                    </Form.Row>
                    <fieldset>
                        <Form.Group as={Row} className="form-row">
                    
                            <Form.Label as="legend" column sm={2}>
                                <h5>Select ER Mode:</h5>
                            </Form.Label>                    
                            <Col sm={8}>
                                <Form.Check
                                    type="radio"
                                    label="Dirty Entity Resolution"
                                    name="er_mode"
                                    value="dirty"
                                    onChange={this.onChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Clean-Clean Entity Resolution"
                                    name="er_mode"
                                    value="clean"
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>

                    <hr style={{ color: 'black', backgroundColor: 'black', height: '5' }}/>
                    
                    <br/>
                    
                   <ProfileReader entity_id="1" title="Entity profiles D1:" disabled={this.state.er_mode === ""} type="entity" setEntity={this.setEntity}/>   
                   <ProfileReader entity_id="2" title="Entity profiles D2:" disabled={this.state.er_mode !== "clean"} type="entity" setEntity={this.setEntity}/> 
                   <ProfileReader entity_id="3" title="Ground-Truth file:" disabled={this.state.er_mode === ""} type="ground-truth" setEntity={this.setEntity}/>   
                   
                
            </div>   
        )
    }
}

export default DataReader
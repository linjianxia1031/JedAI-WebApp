import React, {  Component } from 'react'
import PropTypes from 'prop-types';
import {Jumbotron, Form, Button } from 'react-bootstrap/'
import axios from 'axios';
import ConfigureCSV from './ConfigureCSV'
import ConfigureRDB from './ConfigureRDB'
import ConfigureRDF from './ConfigureRDF'
import ConfigureXML from './ConfigureXML'
import ConfigureSerialized from './ConfigureSerialized'
import "../../../../css/main.css"


/**
 * Configurations of CSV files
 */
 
class Configurations extends Component {

    constructor(...args) {
        super(...args);
        this.disabled = true
        this.onChange = this.onChange.bind(this)

        this.state = { 
            configuration: null
        }

    }


    onChange(conf_state, isDisable) {
        this.disabled = isDisable
        let {configuration} = this.state;
        configuration = conf_state;
        this.setState({configuration});
        this.collapse_conf_flag = false;
    } 
    
    onSubmit = (e) => {
        //calculate and return msg to profileReader
        e.preventDefault()
        var text_area_msg
        let formData = new FormData()
        switch(this.props.filetype) {
            case "CSV":
                formData.append('file', this.state.configuration.file )
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  +"\nAtributes in firts row: " + this.state.configuration.first_row + "\nSeperator: " + this.state.configuration.seperator + "\nID index: "+ this.state.configuration.id_index
                break;
            case "Database":
                text_area_msg = this.state.configuration === null? "" : "\nURL: " +  this.state.configuration.url  +"\nTable: " + this.state.configuration.table + "\nUsername: " + this.state.configuration.username + "\nSSL: "+ this.state.configuration.ssl
                break;
            case "RDF":
                formData.append('file', this.state.configuration.file )
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  
                break;
            case "XML":
                formData.append('file', this.state.configuration.file )
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  
                break;
            case "Serialized":
                formData.append('file', this.state.configuration.file )
                text_area_msg = this.state.configuration === null? "" : "\nFile: " +  this.state.configuration.filename  
                break;
            default:
                text_area_msg = ""
        }


        // Form the data that will be sent to server
        formData.append('entity_id', this.props.entity_id)
        formData.append('filetype', this.props.filetype)
        Object.keys(this.state.configuration).forEach((key) => { formData.append(key, this.state.configuration[key]);})
       
        axios({
            url: '/desktopmode/dataread',
            method: 'POST',
            data: formData
        }).then(res => {this.props.submitted(res.data, text_area_msg)});

        
    
    }

    render() {
        var configureSource
        switch(this.props.filetype) {
            case "CSV":
                configureSource =  <ConfigureCSV  onChange={this.onChange} />
                break;
            case "Database":
                configureSource  = <ConfigureRDB  onChange={this.onChange}/>
                break;
            case "RDF":
                configureSource = <ConfigureRDF  onChange={this.onChange} />
                break;
            case "XML":
                configureSource = <ConfigureXML  onChange={this.onChange} />
                break;
            case "Serialized":
                configureSource = <ConfigureSerialized onChange={this.onChange} />
                break;
            default:
                configureSource = <div />
        }

        return (

            <Jumbotron style={{backgroundColor:"white", border:"groove" }}>
                <div>
                    <Form>
                        {configureSource}
                        
                        <div style={{textAlign: 'center',  marginTop: '30px'}}>
                            <Button type="submit" onClick={this.onSubmit} disabled={this.disabled}>Save Configuration</Button>
                        </div>
                    </Form>
                </div>
                
            </Jumbotron>
        )
    }
}


Configurations.propTypes = {
    filetype: PropTypes.string.isRequired,
    entity_id: PropTypes.string.isRequired,
    submitted: PropTypes.func.isRequired
  }

export default Configurations
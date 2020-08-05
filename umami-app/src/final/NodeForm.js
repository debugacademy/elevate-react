import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class NodeForm extends Component {
  state = {
    node: this.props.node
  }

  getFieldWidget(fieldName) {
    const fieldDefinitions = this.getRecipeFields();
    const widget = fieldDefinitions[fieldName].widget;
    const fieldLabel = this.state.node.renderable[fieldName].label;
    const fieldValue = this.state.node.renderable[fieldName].value;

    switch(widget.type) {
      case 'text-long':
          return <TextField
          id={fieldName}
          name={fieldName}
          label={fieldLabel}
          multiline
          rowsMax="5"
          value={fieldValue}
          onChange={(event) => this.props.updateField(event, this.state.node.uuid)}
          margin="normal"
          variant="filled"
        />
        break;
      case 'select':
        break;
      case 'integer':
        return <TextField
          id={fieldName}
          name={fieldName}
          label={fieldLabel}
          value={fieldValue}
          onChange={(event) => this.props.updateField(event, this.state.node.id, {type: 'number', min: 0, max: 100, type: 'integer'})}
          type="number"
          margin="normal"
          variant="filled"
        />;
        break;
      case 'checkbox':
      return <FormControlLabel
      control={
        <Checkbox type="checkbox" onChange={(event) => this.props.updateField(event, this.props.node.id)} name={fieldName} 
     defaultValue={this.state.node.renderable && this.state.node.renderable[fieldName] && this.state.node.renderable[fieldName].value}/>
      }
      label={fieldLabel}
    />
        break;
      case 'text':
      default:
        return <TextField
          id={fieldName}
          name={fieldName}
          label={fieldName}
          value={this.state.node.renderable[fieldName].value}
          key={fieldName}
          onChange={(event) => this.props.updateField(event, this.state.node.id)}
    />
    }
  }

  getRecipeFields() {
    return {
      title: {
        label: "Title",
        defaultValue: '',
        widget: {
          type: 'text',
          options: {}
        }
      },
      field_summary: {
        label: "Description",
        defaultValue: '',
        widget: {
          type: 'text-long',
          options: {}
        }
      },
      field_preparation_time: {
        label: "Preparation time",
        defaultValue: 0,
        widget: {
          type: 'integer',
          options: {}
        }
      },
      status: {
        label: "Published?",
        defaultValue: false,
        widget: {
          type: 'checkbox',
          options: {}
        }
      }
    };
  }

  getFormFieldComponents() {
    const nodeFormFields = [];
    let nodeFields = {};
    if (this.state.node.type === "node--recipe") {
      nodeFields = {...this.getRecipeFields()};
    }
    else {
      for (const field in this.state.node) {
        if (this.state.node.hasOwnProperty(field)) {
          nodeFields[field] = this.state.node[field];
        }
      }
    }

    for (const field in nodeFields) {
      if (nodeFields.hasOwnProperty(field)) {
        const fieldValue = typeof this.state.node[field] !== 'undefined' ? this.state.node[field] : nodeFields[field];
        nodeFormFields.push(
          this.getFieldWidget(field)
        )
      }
    }
    return nodeFormFields;
  }

  render() {
    const nodeFormFields = this.getFormFieldComponents();
    return (
    <form noValidate autoComplete="off">
      { nodeFormFields }
      <Button variant="contained" size="small" onClick={(event) => {this.props.submitNode(this.props.node); this.props.refreshData();}}>
        <SaveIcon />
        Save
      </Button>
    </form>
    );
  }
}

export default NodeForm;

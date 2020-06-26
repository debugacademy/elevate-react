import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

class NodeDataManager extends React.Component {
  state = {
    dataFetched: false
  }

  formatNodeData(nodeData = { attributes: {}, id: 'new', uuid: 'new', isNew: true, type: 'node--task' }) {
    return {
      renderable: {
        title: {
          label: "Title",
          value: nodeData.attributes && nodeData.attributes.title,
          widget: {
            type: 'text',
            options: {}
          }
        },
        body: {
          label: "Description",
          value: nodeData.attributes && nodeData.attributes.body && nodeData.attributes.body.value,
          widget: {
            type: 'text-long',
            options: {}
          }
        },
        field_completion_percent: {
          label: "Completion %",
          value: nodeData.attributes && nodeData.attributes.field_completion_percent,
          widget: {
            type: 'integer',
            options: {}
          }
        },
        field_project: {
          label: "Project",
          value: nodeData.relationships && nodeData.relationships.field_project && nodeData.relationships.field_project.data && nodeData.relationships.field_project.data.id,
          widget: {
            type: 'select',
            options: {}
          }
        },
        status: {
          label: "Published?",
          value: nodeData.attributes && nodeData.attributes.status === "true" || nodeData.attributes.status === 1 ? 1 : 0,
          widget: {
            type: 'checkbox',
            options: {}
          }
        }
      },
      uuid: nodeData.id,
      id: nodeData.id,
      nid: nodeData.attributes && nodeData.attributes.drupal_internal__nid,
      type: nodeData.type
    };
  }

  formatNodeDataArray(fetchedNodes) {
    const formattedNodeData = {};

    if (fetchedNodes) {
      fetchedNodes.map((nodeData,index) => {
        formattedNodeData[nodeData.id] = this.formatNodeData(nodeData);
        formattedNodeData[nodeData.id].index = index;
      });
    }
    return formattedNodeData;
  }

  loadAllNodes(nodeType) {
    var url = this.props.endpoint + '/node/' + nodeType + '?include=field_project';
    axios.get(url)
      .then(result => {
        const formattedNodeData = this.formatNodeDataArray(result.data.data);
        this.setState({
          nodes: formattedNodeData,
          rawNodes: result.data.data,
          dataFetched: true
        });
        console.log('success:', result)
      })
      .catch(error => {
        console.log('error loadingAllNodes', error)
        this.setState({fetchFailed: true})
      });
  }

  loadNode(nodeType, uuid) {
    // let autosavedNode = localStorage.getItem('node-' + uuid);
    // if (autosavedNode && false) {
    //   autosavedNode = JSON.parse(autosavedNode);
    //   this.setState({
    //     node: autosavedNode,
    //     dataFetched: true
    //   });
    //   return;
    // }

    var url = this.props.endpoint + '/node/' + nodeType + '/' + uuid;
    axios.get(url)
      .then(result => {
        const formattedNodeData = this.formatNodeData(result.data.data);
        this.setState({
          node: formattedNodeData,
          dataFetched: true});
        console.log('success:', result)
      })
      .catch(error => {
        console.log('error loadNode', error);
        this.setState({fetchFailed: true})
      });
  }


  loadTaskThenProjectThenPM(uuid) {
    var url = this.props.endpoint + '/node/task/' + uuid;
    axios.get(url)
      .then(result => {
        const formattedNodeData = this.formatNodeData(result.data.data);
        this.setState({
          node: formattedNodeData,
          dataFetched: true});
        console.log('success loading task:', result)
        return axios.get(this.props.endpoint + '/node/task/' + result.data.data.relationships.field_project.data.id);
      })
      .then(result => {
        console.log('success loading task project:', result)
        let node = this.state.node;
        node.renderable.project = {
          label: "Project",
          value: result.data.data.attributes.title
        };
        this.setState({
          node: node
        });

        return axios.get(this.props.endpoint + '/user/user/' + result.data.data.relationships.field_project_manager.data.id);
      })
      .then(result => {
        console.log('success loading projects PM:', result)
        let node = this.state.node;
        node.renderable.project_manager = {
          label: "PM",
          value: result.data.data.attributes.name
        };
        this.setState({
          node: node
        });
      })
      .catch(error => {
        this.setState({fetchFailed: true})
      });
  }

  loadTaskIncludeProjectAndPM(uuid) {
    var url = this.props.endpoint + '/node/task/' + uuid + '?include=field_project.field_project_manager';
    axios.get(url)
      .then(result => {
        const formattedNodeData = this.formatNodeData(result.data.data);
        formattedNodeData.renderable.project = {
          label: "Project",
          value: result.data.included[0].attributes.title
        };
        formattedNodeData.renderable.project_manager = {
          label: "PM",
          value: result.data.included[1].attributes.name
        };
        this.setState({
          node: formattedNodeData,
          dataFetched: true}
        );
        return axios.get(this.props.endpoint + '/node/task/' + result.data.data.relationships.field_project.data.id);
      })
      .catch(error => {
        this.setState({fetchFailed: true})
      });
  }

  changeNodeLocal(event = null, nodeUUID, options = {}, modifiedNode = null) {
    let changedNode = {};
    if (modifiedNode) {
      changedNode = {...modifiedNode};
    }
    else if (this.state.nodes) {
      changedNode = {...this.state.nodes[nodeUUID]};
    }
    else {
      changedNode = {...this.state.node};
    }
    if (event) {
      if (event.target.type && event.target.type === 'checkbox') {
        changedNode.renderable[event.target.name].value = event.target.checked;
        return;
      }
      if (event.target.type && event.target.type === 'number') {
        if (typeof options.min !== 'undefined' && parseInt(event.target.value) < options.min) {
          return;
        }
        if (options.max && parseInt(event.target.value) > options.max) {
          return;
        }
        if (options.type && options.type === 'integer') {
          event.target.value = parseInt(event.target.value);
        }
      }
      changedNode.renderable[event.target.name].value = event.target.value;
    }

    if (this.state.node) {
      this.setState({
        node: changedNode
      });      
    }
    else {
      this.setState((prevState, props) => {
        const prevNodes = prevState.nodes;
        prevNodes[nodeUUID] = changedNode;
        return {
          nodes: prevNodes
        }
      });            
    }
    localStorage.setItem('node-' + changedNode.uuid, JSON.stringify(changedNode));
  }

  createNode() {
    if (this.state.nodes && this.state.nodes.new) {
      // We already have an unsaved node, not creating another one. 
      return;
    }
    const newNode = this.formatNodeData();

    this.setState((prevState, props) => {
      let nodes = {};
      if (prevState.nodes) {
        nodes = { ...prevState.nodes }
      }
      nodes.new = newNode;
      return {nodes: nodes};
    }); 
    return newNode;
  }

  submitNewNode(node) {
    var url = this.props.endpoint + '/node/task';
    var preparedData = this.normalizeNodeData(node);
    axios.post(url, JSON.stringify(preparedData),
      {
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-type": "application/vnd.api+json"
        }
      })
      .then(function(response) {
        console.log('Saved successfully', response);
      })
      .catch(error => {
        this.setState({fetchFailed: true})
      });
  }

  normalizeNodeData(node) {
    var preparedData = {
      data: {
        type: 'node--task',
        attributes: {
          title: node.renderable.title.value
        }
      }
    };
    if (node.id != 'new') {
      preparedData.data.id = node.id;
    }
    if (node.renderable.body && node.renderable.body.value) {
      preparedData.data.attributes.body = node.renderable.body.value;
    }
    if (node.renderable.field_completion_percent && node.renderable.field_completion_percent.value) {
      preparedData.data.attributes.field_completion_percent = node.renderable.field_completion_percent.value;
    }
    if (typeof node.renderable.status !== 'undefined' && typeof node.renderable.status.value !== 'undefined') {
      preparedData.data.attributes.status = node.renderable.status.value === "true" || node.renderable.status.value === 1 || node.renderable.status.value === true ? true : false;
    }
    return preparedData;
  }

  submitNode(node) {
    if (node.id === 'new') {
      return this.submitNewNode(node);
    }
    var url = this.props.endpoint + '/node/task/' + node.id;
    const preparedData = this.normalizeNodeData(node);
    axios.patch(url, JSON.stringify(preparedData),
      {
        headers: {
          "Accept": "application/vnd.api+json",
          "Content-type": "application/vnd.api+json"
        }
      })
      .then(function(response) {
        console.log('Saved successfully', response);
      })
      .catch(error => {
        this.setState({fetchFailed: true})
      });
  }

  getData() {
    const uuid = this.props.nodeUuid;
    if (uuid) {
      this.loadTaskIncludeProjectAndPM(uuid);
    }
    else if (this.props.newNode) {
      this.createNode();
    }
    else {
      this.loadAllNodes(this.props.nodeType);
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const changeNodeLocal = this.changeNodeLocal.bind(this);
    const loadNode = this.loadNode.bind(this);
    const createNode = this.createNode.bind(this);
    const submitNode = this.submitNode.bind(this);
    const refreshData = this.getData.bind(this);

    const renderPropParameters = { changeNodeLocal, refreshData, createNode, loadNode, submitNode, ...this.state, inheritProps: this.props };
    if (this.state.dataFetched || this.state.nodes && this.state.nodes.new) {
      return this.props.children(renderPropParameters);
    }
    return <CircularProgress/>
  }
}

export default NodeDataManager;

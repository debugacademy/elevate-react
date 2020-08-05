import React from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

const NodeDataManager = (props) => {
  const [dataFetched, setDataFetched] = React.useState(false)
  const [nodes, setNodes] = React.useState({})
  const [currentNode, setCurrentNode] = React.useState({})
  const formatNodeData = (nodeData = { attributes: {}, id: 'new', uuid: 'new', isNew: true, type: 'node--recipe' }) => {
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
        field_summary: {
          label: "Description",
          value: nodeData.attributes && nodeData.attributes.field_summary && nodeData.attributes.field_summary.value,
          widget: {
            type: 'text-long',
            options: {}
          }
        },
        field_preparation_time: {
          label: "Preparation time",
          value: nodeData.attributes && nodeData.attributes.field_preparation_time,
          widget: {
            type: 'integer',
            options: {}
          }
        },
        // field_project: {
        //   label: "Project",
        //   value: nodeData.relationships && nodeData.relationships.field_project && nodeData.relationships.field_project.data && nodeData.relationships.field_project.data.id,
        //   widget: {
        //     type: 'select',
        //     options: {}
        //   }
        // },
        status: {
          label: "Published?",
          value: nodeData.attributes && nodeData.attributes.status == true || nodeData?.attributes?.status == 1 ? 1 : 0,
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

  const formatNodeDataArray = (fetchedNodes) => {
    const formattedNodeData = {};

    if (fetchedNodes) {
      fetchedNodes.map((nodeData,index) => {
        formattedNodeData[nodeData.id] = formatNodeData(nodeData);
        formattedNodeData[nodeData.id].index = index;
      });
    }
    return formattedNodeData;
  }

  const loadAllNodes = (nodeType) => {
    var url = props.url + props.endpoint + '/node/' + nodeType; // + '?include=field_project';
    axios.get(url)
      .then(result => {
        const formattedNodeData = formatNodeDataArray(result.data.data);
        setDataFetched(true)
        setNodes(formattedNodeData)
        console.log('success:', result)
      })
      .catch(error => {
        console.log('error loadingAllNodes', error)
      });
  }

  const loadNode = (nodeType, uuid) => {
    var url = props.url + props.endpoint + '/node/' + nodeType + '/' + uuid;
    axios.get(url)
      .then(result => {
        const formattedNodeData = formatNodeData(result.data.data);
        setDataFetched(true)
        setCurrentNode(formattedNodeData)
        console.log('success:', result)
      })
      .catch(error => {
        console.log('error loadNode', error);
      });
  }

  const changeNodeLocal = (event = null, nodeUUID, options = {}, modifiedNode = null) => {
    let changedNode = {};
    if (modifiedNode) {
      changedNode = {...modifiedNode};
    }
    else if (nodes) {
      changedNode = {...nodes[nodeUUID]};
    }
    else {
      changedNode = {...currentNode};
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

    if (currentNode) {
      setCurrentNode(changedNode)
    }
    else {
      setNodes((nodes) => {
        const prevNodes = {...nodes}
        prevNodes[nodeUUID] = changedNode
        return prevNodes
      })
    }
    localStorage.setItem('node-' + changedNode.uuid, JSON.stringify(changedNode));
  }

  const getSessionToken = async () => {
    return axios.get(props.url + '/session/token')
      .then(result => {
        console.log('session token', result)
        return result;
      })
  }

  const createNode = () => {
    if (nodes && nodes.new) {
      // We already have an unsaved node, not creating another one. 
      return;
    }
    const newNode = formatNodeData();

    let updatedNodes = {}
    if (nodes) {
      updatedNodes = { ...nodes }
    }
    updatedNodes.new = newNode
    setNodes(updatedNodes)

    return newNode;
  }

  const submitNewNode = (node) => {
    var url = props.url + props.endpoint + '/node/recipe';
    var preparedData = normalizeNodeData(node);
    getSessionToken().then((token) => {
      return axios.post(url, JSON.stringify(preparedData),
        {
          headers: {
            "Accept": "application/vnd.api+json",
            "Content-type": "application/vnd.api+json",
            'X-CSRF-Token': token.data
          }
        })
        .then(function(response) {
          console.log('Saved successfully', response);
        })
        .catch(error => {
        });

    })
  }

  const normalizeNodeData = (node) => {
    var preparedData = {
      data: {
        type: 'node--recipe',
        attributes: {
          title: node.renderable.title.value
        }
      }
    };
    if (node.id != 'new') {
      preparedData.data.id = node.id;
    }
    if (node.renderable.field_summary && node.renderable.field_summary.value) {
      preparedData.data.attributes.field_summary = node.renderable.field_summary.value;
    }
    if (node.renderable.field_preparation_time && node.renderable.field_preparation_time.value) {
      preparedData.data.attributes.field_preparation_time = node.renderable.field_preparation_time.value;
    }
    if (typeof node.renderable.status !== 'undefined' && typeof node.renderable.status.value !== 'undefined') {
      preparedData.data.attributes.status = node.renderable.status.value === "true" || node.renderable.status.value === 1 || node.renderable.status.value === true ? true : false;
    }
    return preparedData;
  }

  const submitNode = (node) => {
    if (node.id === 'new') {
      return submitNewNode(node);
    }
    var url = props.url + props.endpoint + '/node/recipe/' + node.id;
    const preparedData = normalizeNodeData(node);
    console.log('Submitting node..', preparedData)
    getSessionToken().then((token) => {
      axios.patch(url, JSON.stringify(preparedData),
        {
          headers: {
            "Accept": "application/vnd.api+json",
            "Content-type": "application/vnd.api+json",
            'X-CSRF-Token': token.data
          }
        })
        .then(function(response) {
          console.log('Saved successfully', response);
        })
        .catch(error => {
        });
      })
  }

  const refreshData = () => {
    const uuid = props.nodeUuid;
    if (uuid) {
      loadNode('recipe', uuid);
    }
    else if (props.newNode) {
      createNode();
    }
    else {
      loadAllNodes(props.nodeType);
    }
  }

  React.useEffect(() => {
    refreshData();
  })

  let node = currentNode
  const renderPropParameters = { changeNodeLocal, refreshData, createNode, loadNode, submitNode, dataFetched, nodes, node, inheritProps: props };
  if (dataFetched || nodes && nodes.new) {
    return props.children(renderPropParameters);
  }
  return <CircularProgress/>

}

export default NodeDataManager;

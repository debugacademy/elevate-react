import React, { Component } from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import NodeView from '../final/NodeView';
import NodeForm from '../final/NodeForm'

class NodeList extends Component {
  getNodeListRows() {
    const nodeRows = [];
    for (const uuid in this.props.nodes) {
      if (this.props.nodes.hasOwnProperty(uuid)) {
        let node = this.props.nodes[uuid];
        if (!node.isNew) {
          let nodeDisplay = <NodeView node={node}/>;
          if (node.mode === 'edit') {
                nodeDisplay = <NodeForm node={node} updateField={this.props.updateNode} submitNode={this.props.submitNode} refreshData={this.props.refreshData} />;
          }
          nodeRows.push(
            <GridListTile key={node.uuid} cols={node.isNew ? 3 : 1} rows={node.isNew ? 5 : 1}>
              <div style={{paddingTop: `70px`}}>
                {nodeDisplay}
                <GridListTileBar
                  title={node.renderable.title.value}
                  titlePosition="top"
                  actionPosition="left"
                />
              </div>
              <button name={node.uuid + '-edit'} onClick={() => {
                node.mode = node.mode === 'edit' ? 'view' : 'edit';
                this.props.updateNode(null, uuid, {}, node);
              }}>{node.mode != 'edit' ? "Edit mode" : "View mode"}</button>
            </GridListTile>
          );
        }
      }
    }
    return nodeRows;
  }

  render() {
    if (this.props.dataFetched || this.props.nodes) {
      const nodeListRows = this.getNodeListRows();
      let newNode = '';
      if (this.props.nodes.new) {
        let node = this.props.nodes.new;
        newNode = <GridListTile key={node.uuid} cols={node.isNew ? 3 : 1}>
            <GridListTileBar
              title={"Create new node"}
              titlePosition="bottom"
              actionPosition="left"
            />
            <NodeForm node={node} updateField={this.props.updateNode} submitNode={this.props.submitNode} refreshData={this.props.refreshData}></NodeForm>
          </GridListTile>;
      }
      return (
        <div>
          <button onClick={this.props.refreshData}>Refresh node list</button>
          {/* @TODO: Add button for creating new nodes here, similar to the Refresh node list button */}
          <GridList cellHeight={500} cols={3} spacing={1}>
            {newNode}
            {nodeListRows}
          </GridList>
        </div>
      );
    }
    return 'Loading...';
  }
}

export default NodeList;
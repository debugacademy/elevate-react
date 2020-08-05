import React from 'react';
import FieldDisplay from '../final/FieldDisplay'

const NodeView = ({dataFetched, node, style}) => {
  if (!dataFetched && !node) {
    return "Loading...";
  }

  const renderNode = [];
  if (node) {
    for (const field in node.renderable) {
      if (node.renderable.hasOwnProperty(field)) {
        renderNode.push(
          <FieldDisplay key={node.id + node.renderable[field].label} fieldLabel={node.renderable[field].label} fieldValue={node.renderable[field].value}/>
        );
      }
    }

    return (
      <div style={style}>

      {renderNode}
      </div>
    );
  }
}

export default NodeView;
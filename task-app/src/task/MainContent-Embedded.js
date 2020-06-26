import React, { useState } from 'react';
import Theme             from '../final/theme';
import Home              from '../final/Home';
import NodeList          from '../task/NodeList';
import NodeDataManager   from '../final/NodeDataManager';
import ErrorBoundary     from '../final/ErrorBoundary';
import { DrupalContext } from '../index';

const TabContainer = (props) => {
  return (
    <div component="div" style={{ padding: '24px' }}>
      {props.children}
    </div>
  );
}

function MainContent (props) {
  const theme = Theme();
  const style = props.style;

  return (
    <section id="main-content" style={{...theme.region, ...style}}>
      {/* @TODO: Turn this into a tabbed section */}
      {/* This is where the "Home" tab's content would start */}
      <ErrorBoundary>
        <Home/>
      </ErrorBoundary>

      {/* This is where the "Node List" tab's content would start */}
      <ErrorBoundary>
        <DrupalContext.Consumer>
          {({siteUrl, endpoint}) => {
            // @TODO: when enabling new task creation, pass appropriate function from NodeDataManager to NodeList
            return <NodeDataManager key={'task'} endpoint={siteUrl+endpoint} nodeType={'task'}>
            {({nodes, changeNodeLocal, submitNode, refreshData}) => (
              <NodeList nodes={nodes} updateNode={changeNodeLocal} submitNode={submitNode} refreshData={refreshData} />
            )}
            </NodeDataManager>;
          }}
        </DrupalContext.Consumer>
      </ErrorBoundary>
      {props.children}
    </section>
  );
}
export default MainContent;

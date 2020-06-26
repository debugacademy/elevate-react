import React, { useState } from 'react';
import Theme             from '../final/theme';
import Home              from '../final/Home';
import NodeList          from '../final/NodeList';
import NodeDataManager   from '../final/NodeDataManager';
import ErrorBoundary     from '../final/ErrorBoundary';
import {DrupalContext}   from '../index';
import {AppBar, Tabs, Tab } from '@material-ui/core'

const TabContainer = (props) => {
  return (
    <div style={{ padding: 24 }}>
      {props.children}
    </div>
  );
}

const MainContent = (props) => {
  const theme = Theme();
  const style = props.style;

  const [tabInternalPath, selectTab] = useState("/"); 

  return (
    <section id="main-content" style={{...theme.region, ...style}}>
      <AppBar position="static">
          <Tabs value={tabInternalPath} onChange={(event, value) => selectTab(value)}>
            <Tab value="/" label="Home" />
            <Tab value="/node/list" label="List tasks" />
          </Tabs>
        </AppBar>
        {tabInternalPath === "/" && <TabContainer>
          <ErrorBoundary>
            <Home/>
          </ErrorBoundary>
        </TabContainer>}
        {tabInternalPath === "/node/list" && <TabContainer>
          <ErrorBoundary>
            <DrupalContext.Consumer>
              {({siteUrl, endpoint}) => {
                return <NodeDataManager key={'task'} endpoint={siteUrl+endpoint} nodeType={'task'}>
                {({nodes, createNode, changeNodeLocal, submitNode, refreshData}) => <NodeList nodes={nodes} createNode={createNode} updateNode={changeNodeLocal} submitNode={submitNode} refreshData={refreshData} />}
                </NodeDataManager>;
              }}
            </DrupalContext.Consumer>
          </ErrorBoundary>
        </TabContainer>}
      {props.children}
    </section>
  );
}
export default MainContent;

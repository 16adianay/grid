import './Machines.scss';
import { machines, testTypes, logs } from "./data.js";
import 'devextreme-react/tag-box'
import React, {useCallback, useMemo, useRef} from 'react';
import { Button } from "devextreme-react/button";
import TagBoxContent from "./TagBoxContent.js";
import { List } from 'devextreme-react/list';
import DataGrid, {
  Column, 
  Editing, 
  Lookup, 
  Texts, 
  Selection,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  StateStoring,
} from 'devextreme-react/data-grid';
import TabPanel, { Item as ItemPanel } from "devextreme-react/tab-panel";
import { Drawer } from "devextreme-react/drawer";
import Form, { SimpleItem } from "devextreme-react/form";

function LogsInfo(item) {
  return (
    <>
      <p><b>{item.dateandtime}</b></p>
      <p>{item.message}</p>
    </>
  );
}


function Grid() {
  const [objectSidebarData, setObjectSidebarData] = React.useState({});
  const [selectedRowIndex, setSelectedRowIndex] = React.useState(0);
  const [sidebar, setSidebar] = React.useState(0);
  const ref = useRef();

  const selectionChangedHandler = useCallback((e) => {
    e.selectedRowsData[0] && setObjectSidebarData(e.selectedRowsData[0])
    setSelectedRowIndex(e.component.getRowIndexByKey(e.selectedRowKeys[0]));
    sidebar === 0 && setSidebar(500);
  }, [selectedRowIndex,objectSidebarData]);

  const openSidebar = useCallback(() => {
    sidebar === 500 ? setSidebar(0) : setSidebar(500);
  },[]);

  const editRow = useCallback(() => {
    ref.current.instance.editRow(selectedRowIndex);
    ref.current.instance.deselectAll();
    ref.current.instance.option("focusedRowIndex", -1);

  },[selectedRowIndex]);

  const deleteRow = useCallback(() => {
      ref.current.instance.deleteRow(selectedRowIndex);
      ref.current.instance.deselectAll();
  }, [selectedRowIndex]);

  const addRow = useCallback(() => {
      ref.current.instance.addRow();
      ref.current.instance.deselectAll();
  }, []);


  const cellTemplate = useCallback((container, options) => {
    const noBreakSpace = '\u00A0';
    const text = (options.value || []).map((element) => options.column.lookup.calculateCellValue(element)).join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }, [])

  // const calculateFilterExpression = useCallback((filterValue, selectedFilterOperation, target) => {
  //   if (target === 'search' && typeof (filterValue) === 'string') {
  //     return [this.dataField, 'contains', filterValue];
  //   }
  //   return function(data) {
  //     return (data.TestTypes || []).indexOf(filterValue) !== -1;
  //   };
  // }, [])

  const datapages = useMemo(() => {
      return {
          machines:{
              main:[
                  {
                      dataField: 'name',
                      caption: 'Name',
                      dataType: 'object'
                  },
                  {
                      dataField: 'year',
                      caption: 'Data di creazione',
                      dataType: 'date'
                  },
                  {
                      dataField: 'testId',
                      caption: 'Running Test',
                      dataType: 'string'
                  },
                  {
                      dataField: 'ip',
                      caption: 'ip',
                  }
              ]
          },
          sidebar: {
              main:[
                  {
                      itemPanel: {
                          title: 'Overview',
                          form: {
                              colCount: 2,
                              FormData: objectSidebarData,
                              simpleItem: {
                                  dataField: 'name',
                                  colSpan: 2,
                                  disabled:"true",
                              },
                              simpleItem: {
                                  dataField: 'notes',
                                  colSpan: 2,
                                  disabled:"true",
                              },
                              simpleItem: {
                                  dataField: 'year',
                                  colSpan: null,
                                  disabled:"true",
                              }
                          },
                          textArea: {
                              defaultValue: objectSidebarData.notes,
                              disabled:"true",
                          },
                      },
                  },
                  {
                      itemPanel: {
                          title: 'Stats',
                          textArea: {
                              defaultValue: objectSidebarData.notes,
                              disabled:"true",
                          },
                      },
                  },
                  {
                      itemPanel: {
                          title: 'Capabilities',
                          textArea: {
                              defaultValue: objectSidebarData.notes,
                              disabled:"true",
                          },
                      },
                  },
                  {
                      itemPanel: {
                          title: 'Logs',
                          textArea: {
                              defaultValue: objectSidebarData.notes,
                              disabled:"true",
                          },
                      },
                  },

              ]
          }
      }
  }, [objectSidebarData]);

  const render = useCallback(() => {
      return (<div className={"content-block-sidebar"}>
          <div className={"sidebar-container"}>
              <div className={"flex-container-sidebar"}>
                  <h2>{objectSidebarData.name ? objectSidebarData.name : "Select a machine" }</h2>
                  <div className={"flex-container"}>
                      <Button
                          icon="trash"
                          label="Delete row"
                          visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
                          onClick={deleteRow}
                      />
                      <Button
                        icon="edit"
                        label="Edit row"
                        index={2}
                        visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
                        onClick={editRow}
                        />
                  </div>
              </div>

              <TabPanel className="tabpanel-sidebar">
                  <ItemPanel title="Overview">
                      <Form colCount={2} formData={objectSidebarData}>
                          <SimpleItem colSpan={2} dataField="name" disabled="true"/>
                          <SimpleItem colSpan={2} dataField="notes"  disabled="true"/>
                          <SimpleItem dataField="year" disabled="true"/>
                          <SimpleItem dataField="kWh_consumption" disabled="true"/>
                          <SimpleItem dataField="port" disabled="true" />
                      </Form>
                  </ItemPanel>
                  <ItemPanel title="Stats">
                  </ItemPanel>
                  <ItemPanel title="Logs" badge="new">
                      <List
                          dataSource={logs}
                          searchEnabled={true}
                          height="700"
                          pageLoadMode="scrollBottom"
                          searchMode="contains"
                          searchExpr="message"
                          itemRender={LogsInfo}>
                      </List>

                  </ItemPanel>
              </TabPanel>
          </div>
      </div>)
  }, [selectedRowIndex, objectSidebarData]);

  return (
    <React.Fragment>
      <Drawer
        minSize ={sidebar}
        position="right"
        height="100%"
        revealMode="expand"
        openedStateMode="shrink"
        render={render}
      >

        <div className={"content-block flex-container"}>
              <h2>Machines</h2>
              <div className={"flex-container"}>
                <Button           
                  icon={sidebar === 500 ? "chevronnext" : "pinright"}
                  label={sidebar === 500 ? "Close sidebar" : "Open sidebar"}
                  onClick={openSidebar} 
                  >   </Button>
                <Button name="Add Row" icon="plus" onClick={addRow}/>
                <Button name="notify" icon="menu"/>
              </div>
            </div>
            <div className={'content-block content-overlay'}>

        <div className={'dx-card responsive-paddings'}>
        <DataGrid
          id="grid"
          dataSource={machines}
          keyExpr="id"
          ref={ref}
          showBorders={true}
          focusedRowEnabled={true}
          // onFocusedRowChanged={onFocusedRowChanged}
          onSelectionChanged={selectionChangedHandler}                    
          > 
                
            {/*<StateStoring enabled={true} type="localStorage" storageKey="machines_grid" />  */}
            {/*<FilterRow visible={true} />*/}
            {/*<FilterPanel visible={true} />*/}
            {/*<FilterBuilderPopup position={filterBuilderPopupPosition} />*/}
            <HeaderFilter visible={true} />
            <Selection mode="single" />
            <Editing mode="popup" maxWidth="300px">
                  <Texts confirmDeleteMessage="are you sure to delete?" />            
            </Editing>  

            <Column
              dataField="TestTypes"
              caption="Test Types"
              width={200}
              allowSorting={false}
              editCellComponent={TagBoxContent}
              cellTemplate={cellTemplate}
              // calculateFilterExpression={calculateFilterExpression}
              dataType="object">
            <Lookup
              dataSource={testTypes}
              valueExpr="id"
              displayExpr="name"
            />            
            </Column>
            {
              datapages.machines.main.map((attribute) => {
                return <Column
                    alignment='left'
                    dataField={attribute.dataField}
                    caption={attribute.caption? attribute.caption : attribute.dataField}
                    allowSorting={attribute.allowSorting? attribute.allowSorting : null}
                    customizeText={attribute.customizeColumnText ? attribute.customizeColumnText : null}
                    dataType={attribute.dataType ? attribute.dataType : null}
                    key={Math.random()*Date.now()}
                >
                          {attribute.lookup? 
                          <Lookup 
                            dataSource={attribute.lookup.dataSource? attribute.lookup.dataSource : null} 
                            valueExpr={attribute.lookup.valueExpr? attribute.lookup.valueExpr : null} 
                            displayExpr={attribute.lookup.displayExpr? attribute.lookup.displayExpr : null}
                          /> :null}
                        </Column>                      
                }
              )
            }
          
        </DataGrid>
        </div>
      </div>
      </Drawer>
    </React.Fragment>
  );
}

const filterBuilderPopupPosition = {
  of: window,
  at: "top",
  my: "top",
  offset: { y: 10 },
};

export default Grid;






import React from "react";
import * as _ from "lodash";
import {v4 as uuid4v} from "uuid";
import {useAppContext} from "./provider";

type TTable = {
  headers: Array<TTableHeaderCell>
  rows: Array<TTableRow>
}

type TTableHeader = {
  cells: Array<TTableHeaderCell> | React.ReactElement,
  width?: string
};

type TTableHeaderCell = {
  key?: string,
  content: string | React.ReactElement,
  width?: string,
  grow?: boolean
};

type TTableRow = {
  key: string,
  headers: Array<any>,
  cells: Array<TTableCell> | React.ReactElement,
  width?: string
};

type TTableCell = {
  key: string,
  index: number,
  content: string | React.ReactElement,
  width?: string,
  pushRight?: boolean,
  grow?: boolean,
  style: object,
  headers: Array<TTableHeaderCell>,
};

/**
 * Reusable Table component
 * @param props
 * @constructor
 */
export function Table(props: TTable) {
  const {
    isMobile
  } = useAppContext();

  let tableRowComponents = _.map(props.rows, (row) => {
    return <TableRow key={uuid4v()} cells={row.cells} headers={props.headers} />
  });

  return (
    <div className={"table__container"}>
      {!isMobile ? <TableHeader cells={props.headers}/> : null}
      {tableRowComponents.length === 0 ? <div className={"table__no-rows"}>No entries found.</div> : tableRowComponents}
    </div>
  );
}

export function TableHeader(props: TTableHeader) {
  let tableHeadingCellComponents = _.map(props.cells, (cell) => {
    return (
      <TableHeaderCell key={uuid4v()}
                       content={cell.content}
                       width={cell.width}
      />
    )
  });

  return (
    <div className={"table__header"}>
      {tableHeadingCellComponents}
    </div>
  );
}

export function TableHeaderCell(props: TTableHeaderCell) {
  return (
    <div className={"table__header-cell"} style={{width: props.width}}>
      {props.content}
    </div>
  )
}

export function TableRow(props: TTableRow) {
  let tableRowComponents = _.map(props.cells, (cell, index) => {
    return (
      <TableCell key={uuid4v()}
                 index={index}
                 headers={_.map(props.headers, header => {return header.content})}
                 content={cell.content}
                 width={cell.width}
                 pushRight={cell.pushRight}
                 style={cell.style}
      />
    )
  });

  return (
    <div className={"table__row"} style={{width: props.width}}>
      {tableRowComponents}
    </div>
  );
}

export function TableCell(props: TTableCell) {
  const {
    isMobile
  } = useAppContext();

  const style = Object.assign(props.style || {}, {
    width: isMobile ? null : props.width,
    marginLeft: props.pushRight ? "auto" : null
  });

  const renderMobileTableCell = () => {
    return (
      <div className={"table__mobile-cell"}>
        <div className="table__mobile-cell-header" style={{width: "40%"}}>
          {props.headers[props.index]}
        </div>
        <div style={{width: "60%"}}>
          {props.content}
        </div>
      </div>
    );
  }

  return (
    <div className={"table__cell"}
         style={style}>
      {isMobile ? renderMobileTableCell() : props.content}
    </div>
  );
}
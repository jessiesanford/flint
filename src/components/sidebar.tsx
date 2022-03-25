import React, {useState, useEffect, useRef} from "React";
import {AppToolType} from "./appContainer";
import {useAppContext} from "./provider";
import {map} from "lodash";
import LineIcon from "react-lineicons";

const fakeDelay = 2000;

export function SideBar() {
  const {
    isMobile
  } = useAppContext();

  let sideBarRef = useRef(null);
  const [sideBarHidden, setSideBarHidden] = useState(true);

  useEffect(() => {
    setSideBarHidden(false);
  }, [isMobile]);

  // a part of my little fake delay initiative
  useEffect(() => {
    if (sideBarRef.current && !isMobile) {
      setTimeout(() => {
        setSideBarHidden(false)
      }, fakeDelay + 400);
    }
  }, []);

  const style = {
    left: sideBarHidden ? (isMobile ? "-100%" : "-300px") : "0px"
  }

  return (
    <>
      <div className={"sidebar__expander"} onClick={() => setSideBarHidden(!sideBarHidden)}>
        <div className={"logo-wrapper"}>
          <div className={"logo-icon"}/>
          <div className={"logo"}>Conduit</div>
        </div>
      </div>
      <div className={"sidebar"}>
        <div className={"sidebar__popout"} ref={sideBarRef} style={style}>
          <div className={"sidebar__heading"}>
            <div className={"logo-wrapper"}>
              <div className={"logo-icon"}/>
              <div className={"logo"}>Conduit</div>
            </div>
            <div className={"sidebar__collapser"} onClick={() => setSideBarHidden(!sideBarHidden)}>
              <LineIcon name={"cross-circle"}/>
            </div>
          </div>
          {sideBarHidden ? null : <Navigation/>}
        </div>
      </div>
    </>
  )
}

export function Navigation() {
  const navItems = [
    {
      id: AppToolType.PaymentManager,
      name: "Manage Payments",
    },
    {
      id: AppToolType.ExpenseTracker,
      name: "Track Expenses",
    },
  ]

  let navItemComps = map(navItems, (item) => {
    return <NavigationItem key={item.id} item={item}/>
  })

  return (
    <div className={"navigation"}>
      {navItemComps}
    </div>
  )
}

export function NavigationItem(props: any) {
  const {
    activeToolId,
    changeTool,
  } = useAppContext();

  let isActive = activeToolId === props.item.id;

  return (
    <div className={`navigation__item ${isActive ? "navigation__item--active" : ""}`}
         id={props.item.id}
         onClick={() => {
           changeTool(props.item.id)
         }}>
      {props.item.name}
    </div>
  )
}
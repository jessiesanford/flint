import React from "react";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContainer, AppToolType} from "./appContainer";
import {SideBar} from "./sidebar";

interface TAppContext {
  delegate: AppContainer,
  isMobile: boolean,
  activeToolId: string,
  setProcessing: () => void
}

const AppContext = React.createContext<TAppContext>({
  delegate: undefined,
  isMobile: false,
  activeToolId: null,
  setProcessing: undefined
});

export const useAppContext = () => useContext(AppContext);

type TProvider = {
  delegate: AppContainer;
  render: any;
  loading: boolean;
}

const fakeDelay = 2200;

export function Provider(props: TProvider) {
  const [activeToolId, setActiveToolId] = useState(props.delegate.toolType);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hidden, setHidden] = useState(false);
  const [processing, setProcessing] = useState({text: "", hidden: true});

  // handle window resize, ex. tablet/phone orientation
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  }

  // this is actually much higher than what is require but for demo purposes we're gonna go with 1200
  const isMobile = windowWidth <= 1200;

  const changeTool = (toolId: AppToolType) => {
    setHidden(true);
    setActiveToolId(toolId);
    // another slight delay for some animation UI polish
    setTimeout(()=>{
      props.delegate.setToolType(toolId);
      setHidden(false);
    }, 400);
  }

  // @ts-ignore
  const provided = {
    delegate: props.delegate,
    activeToolId,
    setActiveToolId,
    changeTool,
    setProcessing,
    isMobile
  } as TAppContext;

  let componentsContainer = useRef(null);

  const renderProviderContainer = () => {
    return (
      <div className={"provider"}>
        <SideBar/>
        <ProcessingLabel text={processing.text} hidden={processing.hidden} />
        <div className={"components-container"} ref={componentsContainer} style={{opacity: hidden ? 0 : 1}}>
          {props.render ? props.render() : null}
        </div>
      </div>
    );
  }

  // wrap our react app in a provider for context benefits such as avoiding prop drilling
  return (
    <AppContext.Provider value={provided}>
      {props.loading ? <LoadingSplash/> : renderProviderContainer()}
    </AppContext.Provider>
  );
}

export function ProcessingLabel(props: {text: string, hidden: boolean}) {
  return (
    <div className={"processing-label"} style={{opacity: props.hidden ? 0 : 1}}>{props.text}</div>
  );
}

export function LoadingSplash() {
  let loadingSplashRef = useRef(null);
  let containerRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, fakeDelay);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add("fadeIn");
      }
    }, 500);
  }, []);

  return (
    <div className={`splash-loading ${hidden ? "fadeOut hidden" : ""}`} ref={loadingSplashRef}>
      <div className={"splash-loading__container"} ref={containerRef}>
        <div className={"splash-loading__logo"}>
          <span className={"thick-weight"}>Flint</span>
          <span className={"thin-weight"}>Track</span>
        </div>
        <div className={"splash-loading__spinner"}>
          <div className="lds-ellipsis">
            <div/>
            <div/>
            <div/>
            <div/>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Log } from "@microsoft/sp-core-library";
import {
  //ApplicationCustomizerContext,
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import CustomFooter, {
  ICustomFooterProps,
} from "./components/customFooter/CustomFooter";
import * as strings from "SorpresaApplicationCustomizerStrings";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph, init } from "./components/context/api";

const LOG_SOURCE: string = "SorpresaApplicationCustomizer";
interface ISorpresaEvent {
  StartDate: string;
  EndDate: string;
  isOngoing: boolean;
  EventType: string;
}
export interface ISorpresaApplicationCustomizerProperties {
  Bottom: string;
}

export default class SorpresaApplicationCustomizer extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {
  private _bottomPlaceholder: PlaceholderContent | undefined;

  private sp: ReturnType<typeof spfi>;
  // private _sp: SPFI;
  // private _graph: GraphFI;

  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    //   const graph = () => {
    //     if (!this._graph) {
    //         throw new Error("graph not initialized");
    //     }
    //     return this._graph;
    // };

    this.sp = spfi().using(SPFx(this.context));
    //     this._sp = await spfi("https://tecconsultat.sharepoint.com/sites/Myla").using(spSPFx(this.context));
    //     this._graph = await graphfi().using(graphSPFx(this.context));

    //     const myUserContext = await this._graph

    // console.log("normal sp: " + JSON.stringify(this.sp))
    // console.log("_SP : " + JSON.stringify(this._sp));
    // console.log("_GRAPH : " + JSON.stringify(this._graph));

    await init(this.context);
    const myUserContext = await graph().me();

    console.log(`This is my user: ${JSON.stringify(myUserContext, null, 2)}`);

    this.context.placeholderProvider.changedEvent.add(
      this,
      this._renderPlaceHolders
    );
    return Promise.resolve();
  }

  private async _renderPlaceHolders(): Promise<void> {
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map((name) => PlaceholderName[name])
        .join(", ")
    );
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Bottom,
          { onDispose: this._onDispose }
        );
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      const currentDate = new Date();
      console.log("Get current date...." + currentDate);
      const ongoingEvents = await this.fetchOngoingEvents(currentDate);
      console.log("If there is an ongoing valid event, render gift element");
      if (ongoingEvents.length > 0) {
        const element: React.ReactElement<ICustomFooterProps> =
          React.createElement(CustomFooter, {
            spfxContext: this.context,
          });
        ReactDOM.render(element, this._bottomPlaceholder.domElement);
      }
    }
  }
  private async fetchOngoingEvents(
    currentDate: Date
  ): Promise<ISorpresaEvent[]> {
    console.log("Fetch all items from the SorpresaEvents list.....");
    const siteID = this.context.pageContext.site.id.toString();
    console.log("This site's ID: " + siteID);

    try {
      const events: ISorpresaEvent[] = await this.sp.web.lists
        .getByTitle("SorpresaEvents")
        .select("StartDate,EndDate,isOngoing,isGlobal,LimitedTo,EventType")
        .items();

      console.log(
        "Based on currentDate, filter for ongoing and valid events .... "
      );
      const ongoingEvents = events.filter((event) => {
        const startDate = new Date(event.StartDate);
        const endDate = new Date(event.EndDate);
        return (
          event.isOngoing === true &&
          startDate <= currentDate &&
          endDate >= currentDate
        );
      });
      console.log("ALL EVENTS: " + JSON.stringify(events, null, 2));
      console.log("Ongoing Events: " + JSON.stringify(ongoingEvents, null, 2));
      return ongoingEvents;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching ongoing events:", error);
      return [];
    }
  }
  private _onDispose(): void {
    if (this._bottomPlaceholder) {
      ReactDOM.unmountComponentAtNode(this._bottomPlaceholder.domElement);
      this._bottomPlaceholder = undefined;
    }
    console.log(
      "[SorpresaApplicationCustomizer._onDispose] Disposed custom bottom placeholder."
    );
  }
}

/*
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from '@microsoft/sp-application-base';

import * as React from "react";
import * as ReactDOM from "react-dom";
import CustomFooter, { ICustomFooterProps } from "./components/customFooter/CustomFooter";
import * as strings from 'SorpresaApplicationCustomizerStrings';
import { spfi, SPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';

interface ISorpresaEvent {
  StartDate: string;  
  EndDate: string;    
  isOngoing: boolean;
  EventType: string
}


export interface ISorpresaApplicationCustomizerProperties {
  Bottom: string;
}

export default class SorpresaApplicationCustomizer
  extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {
    private _bottomPlaceholder: PlaceholderContent | undefined;
    private sp: ReturnType<typeof spfi>;

    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
        this.sp = spfi().using(SPFx(this.context));
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        return Promise.resolve();
    }

    private async _renderPlaceHolders(): Promise<void> {
      console.log('Available placeholders: ',
          this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));

      if (!this._bottomPlaceholder) {
          this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
              PlaceholderName.Bottom,
              { onDispose: this._onDispose }
          );
          if (!this._bottomPlaceholder) {
              console.error('The expected placeholder (Bottom) was not found.');
              return;
          }

          
           const currentDate = new Date();
           console.log("Get current date...." + currentDate);
           const ongoingEvents = await this.fetchOngoingEvents(currentDate);

           console.log("If there is an ongoing valid event, render gift element");
           if (ongoingEvents.length > 0) { 
           
          const element: React.ReactElement<ICustomFooterProps> = React.createElement(CustomFooter, {
              spfxContext: this.context
          });

          ReactDOM.render(element, this._bottomPlaceholder.domElement);
        }
      }
    }

    private async fetchOngoingEvents(currentDate: Date): Promise<ISorpresaEvent[]> {
      console.log("Fetch all items from the SorpresaEvents list.....")
      try {
          const events: ISorpresaEvent[] = await this.sp.web.lists
              .getByTitle("SorpresaEvents")
              .select("StartDate,EndDate,isOngoing,EventType")
              .items();
  
              console.log("Based on currentDate, filter for ongoing and valid events .... " +JSON.stringify(events, null, 0));     

              const ongoingEvents = events.filter(event => {
              const startDate = new Date(event.StartDate);
              const endDate = new Date(event.EndDate);
              return event.isOngoing === true && startDate <= currentDate && endDate >= currentDate;
          });
  
          console.log("Ongoing Events: " + JSON.stringify(ongoingEvents, null, 2)); 
          return ongoingEvents;
      } catch (error: any) {
          console.error("Error fetching ongoing events:", error);
          return []; 
      }
  }
  
  
    private _onDispose(): void {
      if (this._bottomPlaceholder) {
        ReactDOM.unmountComponentAtNode(this._bottomPlaceholder.domElement);
        this._bottomPlaceholder = undefined;
      }
      console.log('[SorpresaApplicationCustomizer._onDispose] Disposed custom bottom placeholder.');
    }
}

*/

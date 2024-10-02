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

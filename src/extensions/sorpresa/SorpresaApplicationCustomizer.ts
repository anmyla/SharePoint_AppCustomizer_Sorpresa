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

const LOG_SOURCE: string = 'SorpresaApplicationCustomizer';

export interface ISorpresaApplicationCustomizerProperties {
  Bottom: string;
}

export default class SorpresaApplicationCustomizer
  extends BaseApplicationCustomizer<ISorpresaApplicationCustomizerProperties> {
    private _bottomPlaceholder: PlaceholderContent | undefined;

    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        return Promise.resolve();
    }

    private _renderPlaceHolders(): void {
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

          const element: React.ReactElement<ICustomFooterProps> = React.createElement(CustomFooter, {
              spfxContext: this.context // Passing the SPFx context to CustomFooter
          });

          ReactDOM.render(element, this._bottomPlaceholder.domElement);
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

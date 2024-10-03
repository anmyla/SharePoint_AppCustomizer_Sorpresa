import * as React from "react";
import GiftElement from "./GiftElement";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import CustomAlert from "./CustomAlert";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

export interface ICustomFooterProps {
    spfxContext: ApplicationCustomizerContext; // Received SPFx context
}

export interface ICustomFooterState {
    showAlert: boolean;
    winnerName: string;
    showGiftElement: boolean;
}

export default class CustomFooter extends React.Component<ICustomFooterProps, ICustomFooterState> {
    private sp: ReturnType<typeof spfi>;

    constructor(props: ICustomFooterProps) {
        super(props);

        this.state = {
            showAlert: false,
            winnerName: "",
            showGiftElement: true,
        };

        this.sp = spfi().using(SPFx(this.props.spfxContext));

        this.onElementClick = this.onElementClick.bind(this);
        this.saveWinnerDetails = this.saveWinnerDetails.bind(this);
    }

    private async onElementClick(): Promise<void> {
        console.log("Element is clicked!");
        const winner = await this.sp.web.currentUser();
        console.log(JSON.stringify(winner, null, 2));
        const winnerName = winner.Title;
        this.setState({ showAlert: true, winnerName, showGiftElement: false });

    }

    private temporaryFunctionToCleanCurrentURL(): string {
        const url = window.location.href;
        const urlObject = new URL(url);
        const unwantedParams = ['debugManifestsFile', 'loadSPFX', 'customActions'];
        unwantedParams.forEach(param => urlObject.searchParams.delete(param));
        return urlObject.toString();
    }

    private async saveWinnerDetails(): Promise<void> {
        const user = await this.sp.web.currentUser();
        const list = this.sp.web.lists.getByTitle("SorpresaWinners");
        const cleanedURL = this.temporaryFunctionToCleanCurrentURL();

        console.log("GIFT LOCATION URL: " + cleanedURL)
        const res = await list.items.add({
            Title: user.Title,
            Email: user.Email,
            Website: {
                Url: cleanedURL,
                Description: "Gift location URL"
            }
        });
        console.log("Save winner? " + res);
        console.log("Winner details saved in the SorpresaWinners list successfully!");
        this.setState({ showAlert: false });
    }


    public render(): JSX.Element {
        const { showAlert, winnerName, showGiftElement } = this.state;

        return (
            <div>
                {showGiftElement && <GiftElement onClick={this.onElementClick} />}
                {showAlert && (
                    <CustomAlert
                        winner={winnerName}
                        onConfirm={this.saveWinnerDetails}
                    />
                )}
            </div>
        );
    }
}

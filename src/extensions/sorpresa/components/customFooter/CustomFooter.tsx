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

    private async saveWinnerDetails(): Promise<void> {
        const user = await this.sp.web.currentUser();
        const list = this.sp.web.lists.getByTitle("SorpresaWinners");
        const currentURL = "https://tecconsultat.sharepoint.com/sites/Myla/SiteCustomiser/SitePages/Home.aspx"; //temporary value for testing

        try {
            await list.items.add({
                Title: user.Title,
                Name: user.Title,
                Email: user.Email,
                Website: currentURL.toString(),
            });
            console.log("Winner details saved in the SorpresaWinners list successfully!");
        } catch (error) {
            console.error("Error saving winner details:", error);
        }
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

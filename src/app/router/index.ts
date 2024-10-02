import React from "react";
import Game from "../../page/Game/Game";
import Home from "../../page/Home/Home";

export interface IRoute {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
}

export const routes: IRoute[] = [
    {path: '/home', exact: true, component: Home},
    {path: '/game', exact: true, component: Game}
    
]

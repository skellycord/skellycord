import { getViaProps } from "@skellycord/webpack";
import { React, megaModule } from "@skellycord/webpack/common";

export default () => function TabBar({ items, initTab, onChange }: { items: string[], initTab: number, onChange: (tab: string) => void }) {
    const [ currentTab, setTab ] = React.useState(items[initTab]);

    const { TabBar } = megaModule;
    const { settingsTabBar, settingsTabBarItem } = getViaProps("settingsTabBar", "item");
    
    return <TabBar
        className={settingsTabBar}
        look="brand"
        type="top"
        selectedItem={currentTab}
        onItemSelect={e => {
            onChange(e);
            setTab(e);
        }}
    >
        { items.map((d, i) => <TabBar.Item
            className={settingsTabBarItem}
            id={d}
            key={i}
        >
            { d }
        </TabBar.Item>) }
    </TabBar>;
};
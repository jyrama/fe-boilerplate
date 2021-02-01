import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';

import "antd/es/layout/style";
import Layout from "antd/es/layout";

import "antd/es/menu/style";
import Menu from "antd/es/menu";

import "antd/es/card/style";
import Card from "antd/es/card";

import "antd/es/grid/style";
import { Row, Col } from "antd/es/grid";

import "antd/es/input/style";
import Input from "antd/es/input";

import { ShoppingCartOutlined } from '@ant-design/icons';

import * as productGroups from "../data/productGroups.json";


configure({ enforceActions: 'always' });


interface ProductGroup {
    name: String,
    subgroups: String[]
}

const PRODUCTGROUPS: ProductGroup[] = productGroups; // from GET productgroups

class AppState {
    @observable productCardsOnDisplay: Array<ProductCard>;

    @action
    setProductCardsOnDisplay(cards: Array<ProductCard>) {
        this.productCardsOnDisplay = cards;
    }

    async fetchProductCards() {
        try {
            const res = await fetch("http://localhost:8000/productCards");
            const cards = await res.json();
            this.setProductCardsOnDisplay(cards)
        } catch (error) {
            throw error;
        }
    }


    constructor() {
        this.setProductCardsOnDisplay([]);
        this.fetchProductCards();
    }
}

interface ProductCard {
    name: string,
    thumbnail: string,
    display_price: string
}

@observer
class MainView extends React.Component<{ appState: AppState }, {}> {
    productRows(products: ProductCard[]) {
        const cardWidth = 180;
        let ret: Array<JSX.Element> = [];

        // TODO: there's probably thousand better ways than the initial copy paste rinse and repeat model below to form some rows .. PRs are welcomed

        for (let index = 0; index < products.length; index += 4) {
            let cols: Array<JSX.Element> = [
                <Col offset={1}>
                    <Card hoverable style={{ width: cardWidth }} cover={<img alt="example" src={products[index].thumbnail} />}>
                        <Card.Meta title={products[index].name} description={products[index].display_price} />
                    </Card>
                </Col>
            ];
            if (index + 1 < products.length) {
                cols.push(
                    <Col >
                        <Card hoverable style={{ width: cardWidth }} cover={<img alt="example" src={products[index + 1].thumbnail} />}>
                            <Card.Meta title={products[index + 1].name} description={products[index + 1].display_price} />
                        </Card>
                    </Col>);
            }
            if (index + 2 < products.length) {
                cols.push(
                    <Col>
                        <Card hoverable style={{ width: cardWidth }} cover={<img alt="example" src={products[index + 2].thumbnail} />}>
                            <Card.Meta title={products[index + 2].name} description={products[index + 2].display_price} />
                        </Card>
                    </Col>);
            }
            if (index + 3 < products.length) {
                cols.push(
                    <Col>
                        <Card hoverable style={{ width: cardWidth }} cover={<img alt="example" src={products[index + 3].thumbnail} />}>
                            <Card.Meta title={products[index + 3].name} description={products[index + 3].display_price} />
                        </Card>
                    </Col>);
            }
            ret.push(
                <Row justify="start" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                    {cols}
                </Row>
            );
        }
        return ret;
    }

    render() {
        return (
            <Layout>
                <Layout.Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    <img src="/static/logo.png" alt="logo" style={{ height: "inherit" }}></img>

                    <Menu mode="horizontal" theme="dark">
                        {PRODUCTGROUPS.map((group, groupindex) =>
                            <Menu.SubMenu key={groupindex} title={group.name}>
                                {group.subgroups.map((subgroup, subgroupindex) =>
                                    <Menu.Item key={subgroupindex}>{subgroup}</Menu.Item>
                                )}
                            </Menu.SubMenu>
                        )}
                        <Menu.SubMenu title="Muuta tietoa">
                            <Menu.Item>Yhteystiedot</Menu.Item>
                            <Menu.Item>Aukioloajat</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                    <Input.Search style={{ maxWidth: "20rem" }} />
                </Layout.Header>
                <Layout>
                    <Layout.Content>
                        {this.productRows(this.props.appState.productCardsOnDisplay)}
                    </Layout.Content>

                    <Layout.Sider theme="light">
                        <ShoppingCartOutlined style={{ fontSize: "6rem", width: "100%" }} />
                    </Layout.Sider>
                </Layout>
                <Layout.Footer>
                    <h4>Foobar</h4>
                </Layout.Footer>
            </Layout>


        );
    }

};

const appState = new AppState();

ReactDOM.render(<MainView appState={appState} />, document.getElementById('root'));

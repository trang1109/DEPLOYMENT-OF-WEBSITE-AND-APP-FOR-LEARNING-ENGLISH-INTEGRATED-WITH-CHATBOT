import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Row,
    Spin,
    Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import "./dashBoard.css";
import userApi from '../../apis/userApi';
import statisticsApi from '../../apis/statisticsApi';


const DashBoard = () => {
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await statisticsApi.getAllStatistics().then((res) => {
                    console.log(res);
                    setStatisticList(res)
                    setLoading(false);
                });



            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, []);
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                        <>
                            <Row gutter={12} style={{ marginTop: 20 }}>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticList?.totalMembers}</div>
                                                <div className='title_total'>Số thành viên</div>
                                            </div>
                                            <div>
                                                <ContactsTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticList?.totalClients}</div>
                                                <div className='title_total'>Số học viên</div>
                                            </div>
                                            <div>
                                                <NotificationTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticList?.totalTopics}</div>
                                                <div className='title_total'>Số chủ đề</div>
                                            </div>
                                            <div>
                                                <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticList?.totalVocabularies}</div>
                                                <div className='title_total'>Số từ vựng</div>
                                            </div>
                                            <div>
                                                <ShoppingTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                         
                        </> 
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;
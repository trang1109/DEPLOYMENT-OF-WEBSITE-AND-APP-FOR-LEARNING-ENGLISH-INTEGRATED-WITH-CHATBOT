import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Empty,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    Tag,
    Select,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import vocabApi from "../../apis/vocabApi";
import "./vocabularyManagement.css";
import uploadFileApi from '../../apis/uploadFileApi';
import categoryApi from '../../apis/categoryApi';
const { Option } = Select;

const VocabularyManagement = () => {

    const [category, setCategory] = useState([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();
    const [audio, setAudio] = useState();
    const [file, setUploadFile] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {

            console.log(values);

            const { word, meaning, pronunciation, description, categoryIds } = values;
            const vocabularyData = {
                word,
                meaning,
                pronunciation,
                description,
                imageURL: file,
                audioURL: audio,
                categoryIds,
            };

            return axiosClient.post("/vocabulary", vocabularyData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo từ vựng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo từ vựng thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })
        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {

            const { word, meaning, pronunciation, description, categoryIds } = values;
            const vocabularyData = {
                word,
                meaning,
                pronunciation,
                description,
                imageURL: file,
                audioURL: audio,
                categoryIds,
            };


            return axiosClient.put("/vocabulary/" + id, vocabularyData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa từ vựng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa từ vựng thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await vocabApi.getListVocabulary({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setCategory(res.vocabularies);
                setLoading(false);
            });
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await vocabApi.deleteVocabulary(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa từ vựng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa từ vựng thành công',

                    });
                    setCurrentPage(1);
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await vocabApi.getDetailVocabulary(id);
                setId(id);
                form2.setFieldsValue({
                    word: response.vocabulary.word,
                    meaning: response.vocabulary.meaning,
                    pronunciation: response.vocabulary.pronunciation,
                    description: response.vocabulary.description,
                    categoryIds: response.categories.map(category => category.id),                 });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await vocabApi.searchVocabulary(name);
            setCategory(res.vocabularies);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const handleChangeImage2 = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setAudio(response);
        }
        setLoading(false);
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Từ',
            dataIndex: 'word',
            key: 'word',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Nghĩa',
            dataIndex: 'meaning',
            key: 'meaning',
        },
        {
            title: 'Phát âm',
            dataIndex: 'pronunciation',
            key: 'pronunciation',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageURL',
            key: 'imageURL',
            render: (imageURL) => <img src={imageURL} alt="Ảnh" style={{ width: '50px', height: 'auto' }} />,
        },
        {
            title: 'Audio',
            dataIndex: 'audioURL',
            key: 'audioURL',
            render: (audioURL) => (
                audioURL ? (
                    <audio controls>
                        <source src={audioURL} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                ) : null
            ),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories) => (
                <span>
                    {categories?.map(category => (
                        <Tag key={category.id}>{category.name}</Tag>
                    ))}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{ width: 150, borderRadius: 15, height: 30, marginBottom: 10 }}
                        onClick={() => handleEditCategory(record.id)}
                    >
                        {"Chỉnh sửa"}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn xóa từ vựng này?"
                        onConfirm={() => handleDeleteCategory(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                        >
                            {"Xóa"}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        }

    ];

    const [cate, setCate] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                await vocabApi.getListVocabulary({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategory(res.vocabularies);
                    setLoading(false);
                });

                await categoryApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCate(res.categories);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý từ vựng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo từ vựng</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo từ vựng mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Spin spinning={loading}>
                        <Form
                            form={form}
                            name="eventCreate"
                            layout="vertical"
                            initialValues={{
                                residence: ['zhejiang', 'hangzhou', 'xihu'],
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="word"
                                label="Từ"
                                rules={[{ required: true, message: 'Vui lòng nhập từ!' }]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="meaning"
                                label="Nghĩa"
                                rules={[{ required: true, message: 'Vui lòng nhập nghĩa của từ!' }]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="pronunciation"
                                label="Phát âm"
                                rules={[{ required: true, message: 'Vui lòng nhập phát âm của từ!' }]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                style={{ marginBottom: 10 }}
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name="image"
                                label="Chọn ảnh"
                                rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                                style={{ marginBottom: 10 }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                            <Form.Item
                                name="audioURL"
                                label="Đường dẫn âm thanh"
                                rules={[{ required: true, message: 'Vui lòng chọn âm thanh!' }]}
                                style={{ marginBottom: 10 }}
                            >
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleChangeImage2}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                            <Form.Item
                                name="categoryIds"
                                label="Danh mục"
                                style={{ marginBottom: 10 }}
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn danh mục"
                                >
                                    {cate?.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>

                    </Spin>
                </Modal>


                <Modal
                    title="Chỉnh sửa từ vựng"
                    visible={openModalUpdate}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validation Failed:', info);
                            });
                    }}
                    onCancel={() => setOpenModalUpdate(false)}
                    okText="Cập nhật"
                    cancelText="Hủy"
                >
                    <Form
                        form={form2}
                        layout="vertical"
                        initialValues={{}}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="word"
                            label="Từ"
                            rules={[{ required: true, message: 'Vui lòng nhập từ!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="meaning"
                            label="Nghĩa"
                            rules={[{ required: true, message: 'Vui lòng nhập nghĩa của từ!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="pronunciation"
                            label="Phát âm"
                            rules={[{ required: true, message: 'Vui lòng nhập phát âm của từ!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Chọn ảnh"
                            style={{ marginBottom: 10 }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChangeImage}
                                id="avatar"
                                name="file"
                            />
                        </Form.Item>
                        <Form.Item
                            name="audioURL"
                            label="Đường dẫn âm thanh"
                            style={{ marginBottom: 10 }}
                        >
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleChangeImage2}
                                id="avatar"
                                name="file"
                            />
                        </Form.Item>
                        <Form.Item
                            name="categoryIds"
                            label="Danh mục"
                            style={{ marginBottom: 10 }}
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn danh mục"
                            >
                                {cate?.map(fieldType => (
                                    <Select.Option key={fieldType.id} value={fieldType.id}>
                                        {fieldType.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default VocabularyManagement;
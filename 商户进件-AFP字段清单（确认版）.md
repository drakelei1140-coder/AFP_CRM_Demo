# 商户进件-AFP字段清单（确认版）

## 1. 文档目的

本文档用于明确 **商户进件功能** 中，AFP 相关字段在以下两个场景下的展示与使用范围：

1. **修改信息重新进件弹窗**
2. **进件历史记录弹窗**

本文档只处理 **AFP 进件链路中实际会使用到的字段**，用于统一字段口径，避免后续在原型、前端 demo、文档迭代过程中再次出现字段遗漏、字段回退、字段命名不一致、字段分组错乱的问题。

---

## 2. 适用范围

本文档适用于以下功能：

- 商户进件列表页
- 修改信息重新进件弹窗
- 进件历史记录弹窗
- AFP 相关进件字段快照记录
- 进件重试时的字段回显与差异对比

本文档不处理以下内容：

- 商户主档详情页字段完整定义
- 企业 / 商铺 / 商户新增编辑页字段完整定义
- 产品费率字段展示
- 非 AFP 通道的专属字段定义

---

## 3. 字段使用总原则

### 3.1 字段展示原则

进件弹窗与历史记录弹窗中，AFP 字段统一按以下维度展示：

| 本系统字段名 | AFP接口字段名 | 值 |
| --- | --- | --- |

其中：

- **本系统字段名**：用于给运营、产品、风控人员理解当前字段含义；
- **AFP接口字段名**：用于明确该字段在 AFP 接口中的真实映射位置；
- **值**：用于展示当前这一次进件使用的实际字段值。

### 3.2 历史记录展示原则

进件历史记录弹窗中，字段明细统一按以下格式展示：

| 本系统字段名 | AFP接口字段名 | 修改前值 | 修改后值 |
| --- | --- | --- | --- |

说明：

- **修改前值**：上一次递交给 AFP 时使用的值；
- **修改后值**：本次修改后重新递交给 AFP 时使用的值；
- 若某字段本次未变化，则修改前值与修改后值可相同；
- 若字段是本次新增填写，则修改前值显示为空；
- 若字段被本次清空，则修改后值显示为空。

### 3.3 快照原则

- 修改信息重新进件弹窗中展示的字段值，必须来源于 **最近一次失败进件所使用的字段快照**；
- 进件历史记录弹窗中展示的字段值，必须来源于 **各次递交当时的字段快照**；
- 通过进件弹窗修改的字段，**不得直接覆盖商户主档正式资料**；
- 仅允许写入当前这条进件记录及对应历史记录。

### 3.4 字段冻结原则

以下字段规则在商户进件功能中属于强约束：

- 未列入本文档的 AFP 字段，不允许擅自加入进件弹窗；
- 已列入本文档的字段，不允许擅自删除；
- 不允许擅自修改字段名称；
- 不允许擅自更改字段所属对象分组；
- 不允许把 AFP 字段与商户主档字段混成一个未分组的大表单；
- 不允许把产品费率字段混入 Payment Method 开通字段中展示。

---

## 4. AFP 进件对象范围

本期商户进件功能中，AFP 字段按以下对象分组管理：

1. Company Legal Entity
2. Individual Legal Entity
3. Account Holder
4. Balance Account
5. Business Line
6. Store
7. Payment Method

其中：

- **Company Legal Entity** 主要来源于企业（CID）相关字段；
- **Individual Legal Entity** 主要来源于企业 / 商铺 / 商户关联人员字段；
- **Account Holder / Balance Account / Business Line / Store / Payment Method** 主要用于记录 AFP 开户链路中的实际递交字段与返回结果字段。

---

## 5. Company Legal Entity 字段清单

Company LE 用于创建公司主体的 Legal Entity。

### 5.1 基础识别信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 企业参考号 / 企业外部参考号 | `reference` | 当前企业提交给 AFP 的外部参考号 |
| 企业类型 | `type` | 固定为公司主体类型 |
| 企业法定名称 | `organization.legalName` | 公司法定注册名称 |
| 企业营业名称 / DBA | `organization.doingBusinessAs` | 对外营业名称 |
| 企业描述 | `organization.description` | 企业补充描述 |
| 企业联系电话 | `organization.phone.number` | 公司联系电话 |
| 企业电话国家区号 | `organization.phone.phoneCountryCode` | 电话区号 |
| 企业电话类型 | `organization.phone.type` | 电话类型 |
| 企业邮箱 | `organization.email` | 公司联系邮箱 |

### 5.2 注册地址信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 注册地址-街道 | `organization.registeredAddress.street` | 注册地址街道 |
| 注册地址-补充地址 | `organization.registeredAddress.street2` | 注册地址补充地址 |
| 注册地址-城市 | `organization.registeredAddress.city` | 注册地址城市 |
| 注册地址-州 / 省 | `organization.registeredAddress.stateOrProvince` | 注册地址州省 |
| 注册地址-邮编 | `organization.registeredAddress.postalCode` | 注册地址邮编 |
| 注册地址-国家 | `organization.registeredAddress.country` | 注册地址国家 |

### 5.3 主要营业地址信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 主要营业地址-街道 | `organization.principalPlaceOfBusiness.street` | 主要营业地址街道 |
| 主要营业地址-补充地址 | `organization.principalPlaceOfBusiness.street2` | 主要营业地址补充地址 |
| 主要营业地址-城市 | `organization.principalPlaceOfBusiness.city` | 主要营业地址城市 |
| 主要营业地址-州 / 省 | `organization.principalPlaceOfBusiness.stateOrProvince` | 主要营业地址州省 |
| 主要营业地址-邮编 | `organization.principalPlaceOfBusiness.postalCode` | 主要营业地址邮编 |
| 主要营业地址-国家 | `organization.principalPlaceOfBusiness.country` | 主要营业地址国家 |

### 5.4 注册与税务信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 成立日期 | `organization.dateOfIncorporation` | 公司成立日期 |
| 企业注册号 | `organization.registrationNumber` | 注册编号 |
| 企业治理法律所在国 | `organization.countryOfGoverningLaw` | 治理法律国家 |
| 企业税务国家 | `organization.taxInformation.country` | 税务国家 |
| 企业税号 | `organization.taxInformation.number` | 税号 |
| 企业税号类型 | `organization.taxInformation.type` | 税号类型 |
| VAT号 | `organization.vatNumber` | VAT 号码 |
| 无VAT原因 | `organization.vatAbsenceReason` | 无 VAT 原因 |

### 5.5 上市信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 上市市场标识 | `organization.stockData.marketIdentifier` | 上市市场代码 |
| 股票代码 | `organization.stockData.stockNumber` | 股票代码 |

---

## 6. Individual Legal Entity 字段清单

Individual LE 用于创建自然人主体，适用于以下人员类型：

- 法人
- 董事
- 股东
- UBO
- 授权签字人

### 6.1 展示规则

- 进件历史记录弹窗中，以上人员类型 **全部要有结构**；
- 每个自然人独立成组展示，不允许把多个人员字段混成一个表；
- 若某一类人员本次无数据，可显示为空态，但结构仍需保留；
- 每个自然人组下面都采用统一字段表。

### 6.2 身份基础信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 人员角色 | `entityAssociations.type` | director / signatory / legalRepresentative / uboThroughOwnership / uboThroughControl 等 |
| 人员参考号 / 外部参考号 | `reference` | 当前自然人的外部参考号 |
| 人员类型 | `type` | 固定为 individual |
| 名 | `individual.name.firstName` | firstName |
| 中间名 / 前缀 | `individual.name.infix` | infix |
| 姓 | `individual.name.lastName` | lastName |
| 国籍 | `individual.nationality` | nationality |
| 出生日期 | `individual.birthData.dateOfBirth` | 出生日期 |
| 邮箱 | `individual.email` | 联系邮箱 |

### 6.3 联系电话

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 联系电话 | `individual.phone.number` | 电话号码 |
| 电话类型 | `individual.phone.type` | 电话类型 |

### 6.4 居住地址信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 居住地址-街道 | `individual.residentialAddress.street` | 居住地址街道 |
| 居住地址-补充地址 | `individual.residentialAddress.street2` | 居住地址补充地址 |
| 居住地址-城市 | `individual.residentialAddress.city` | 居住地址城市 |
| 居住地址-州 / 省 | `individual.residentialAddress.stateOrProvince` | 居住地址州省 |
| 居住地址-邮编 | `individual.residentialAddress.postalCode` | 居住地址邮编 |
| 居住地址-国家 | `individual.residentialAddress.country` | 居住地址国家 |

### 6.5 证件与税务信息

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 证件类型 | `individual.identificationData.type` | 证件类型 |
| 证件号码 | `individual.identificationData.number` | 证件号 |
| 证件到期日 | `individual.identificationData.expiryDate` | 到期时间 |
| 签发州 / 省（如适用） | `individual.identificationData.issuerState` | AU 等场景使用 |
| 税务国家 | `individual.taxInformation.country` | 税务国家 |
| 税号 | `individual.taxInformation.number` | 税号 |
| 税号类型 | `individual.taxInformation.type` | 税号类型 |

---

## 7. Company LE 与 Individual LE 关联关系字段清单

该部分用于记录自然人与公司主体的关联关系。

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 关联的人员参考号 / 人员ID | `entityAssociations.legalEntityId` | 被关联的人员 LE ID |
| 关联关系类型 | `entityAssociations.type` | director / signatory / legalRepresentative / uboThroughOwnership / uboThroughControl |
| 持股比例（如后续有） | 扩展字段 | 当前可先按平台扩展字段保留 |
| 是否最终受益人 | `entityAssociations.type` | 可通过类型判断 |

---

## 8. Account Holder 字段清单

Account Holder 用于把主公司 LE 挂到 Balance Platform 下，并进入 capability 审核流程。

### 8.1 递交字段

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Balance Platform ID | `balancePlatform` | 平台 ID |
| Account Holder 参考号 | `reference` | AH 外部参考号 |
| 关联企业 LE ID | `legalEntityId` | 绑定的公司 LE |
| 所申请能力集合 | `capabilities` | 开通能力集合 |

### 8.2 返回结果字段（只读）

以下字段建议在历史记录中展示，但不作为修改信息重新进件弹窗中的可编辑字段：

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| capability-verificationStatus | `capabilities.*.verificationStatus` | 审核状态 |
| capability-allowed | `capabilities.*.allowed` | 是否允许 |
| capability-enabled | `capabilities.*.enabled` | 是否启用 |

---

## 9. Balance Account 字段清单

Balance Account 用于为 Account Holder 创建资金账户。

### 9.1 递交字段

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 关联 Account Holder ID | `accountHolderId` | 绑定的 Account Holder |
| Balance Account 参考号 | `reference` | BA 外部参考号 |
| 默认币种 / 结算币种 | `defaultCurrencyCode` | 默认币种 |

### 9.2 返回结果字段（如有）

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Balance Account ID | 返回字段 | AFP 返回的 BA 标识 |
| Balance Account 状态 | 返回字段 | 可作为只读结果字段展示 |

---

## 10. Business Line 字段清单

Business Line 用于定义支付处理业务线。

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Business Line 参考号 | `reference` | BL 外部参考号 |
| 关联企业 LE ID | `legalEntityId` | 绑定的公司 LE |
| 服务类型 | `service` | 当前通常为 `paymentProcessing` |
| 销售渠道 | `salesChannels` | 当前 POS 场景通常为 `pos` |
| 行业代码 / MCC映射值 | `industryCode` | 行业代码 |
| 业务线描述 / 名称 | `description` | 描述信息 |

补充说明：

- 第一期展示时，应明确 `service` 与 `salesChannels` 的实际值；
- 若后续支持更多场景，可在本组扩展，但不能随意与 Store 字段混合。

---

## 11. Store 字段清单

Store 是 AFP 进件中最容易出错、也最需要在重试时修改的一组字段之一。

### 11.1 基础字段

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Merchant Account ID | `merchantId`（路径参数） | 所属 Merchant Account |
| Store参考号 / 门店编码 | `reference` | Store 外部参考号 |
| Store描述 / 门店名称 | `description` | 门店名称 / 描述 |
| 门店联系电话 | `phoneNumber` | Store 电话 |
| 账单抬头 / Shopper Statement | `shopperStatement` | 账单展示名称 |
| 绑定 Business Line IDs | `businessLineIds` | 绑定业务线 |

### 11.2 地址字段

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 门店地址-街道 | `address.street` | 地址街道 |
| 门店地址-补充地址 | `address.street2` | 地址补充 |
| 门店地址-城市 | `address.city` | 城市 |
| 门店地址-州 / 省 | `address.stateOrProvince` | 州省 |
| 门店地址-邮编 | `address.postalCode` | 邮编 |
| 门店地址-国家 | `address.country` | 国家 |

### 11.3 返回结果字段（只读）

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Store ID | 返回字段 | AFP 返回的 Store 标识 |
| Store状态 | 返回字段 | AFP Store 状态 |

---

## 12. Payment Method 字段清单

### 12.1 展示原则

Payment Method 在商户进件功能中，**只展示开通相关字段，不展示费率字段**。

也就是说：

- 不展示交易费率
- 不展示固定收费-百分比
- 不展示固定收费-绝对值
- 不展示 12 行产品费率表

这些内容属于商户主档费率配置，不属于进件历史记录弹窗的 Payment Method 展示范围。

### 12.2 当前支持的支付产品

当前第一期仅支持以下支付产品：

- Mastercard
- UnionPay
- Visa

### 12.3 开通相关字段

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| 支付产品 | `paymentMethod` / `type` | 支付方式类型 |
| 是否开通 | `enabled` / `allowed` | 开通结果 |
| 通道支付方式配置ID | `paymentMethodId` | 支付方式配置 ID |
| Merchant Account ID | `merchantId`（路径参数） | 所属 MA |
| Store ID（如适用） | `storeId` | 所属 Store |
| 支付方式适用范围 | 扩展配置字段 | 如国家 / 币种等 |

### 12.4 返回结果字段（只读）

| 本系统字段名 | AFP接口字段名 | 说明 |
| --- | --- | --- |
| Payment Method 创建结果 | 返回字段 | 是否创建成功 |
| Payment Method 可用状态 | `allowed` / `enabled` | 可用状态 |
| Payment Method 返回信息 | 返回字段 | 错误或结果说明 |

---

## 13. 修改信息重新进件弹窗字段使用规则

### 13.1 可编辑字段范围

修改信息重新进件弹窗中，可编辑字段应限制在以下对象：

- Company LE
- Individual LE
- Account Holder（仅递交字段）
- Balance Account（仅递交字段）
- Business Line
- Store
- Payment Method（仅开通相关递交字段）

### 13.2 不可编辑字段范围

以下字段只允许查看，不允许在修改信息重新进件弹窗中编辑：

- AFP 返回的 ID 字段
- capability 状态字段
- Payment Method 返回结果字段
- Store 返回状态字段
- 其他纯返回型结果字段

### 13.3 回显原则

- 弹窗打开时，必须回显最近一次失败进件使用的字段快照；
- 若字段上一次为空，则本次可编辑为空态；
- 若字段在历史中不存在，则按空值处理，不允许臆造默认值。

---

## 14. 进件历史记录弹窗展示规则

### 14.1 结构分层

进件历史记录弹窗建议固定分为三层：

#### 第一层：本次进件摘要

展示内容建议包括：

- 历史版本号
- 进件时间
- 操作人
- 通道
- 进件单状态
- 通道进件进度
- 通道返回摘要
- 是否重新进件

#### 第二层：对象分组摘要

展示以下对象块：

- Company LE
- Individual LE
- Account Holder
- Balance Account
- Business Line
- Store
- Payment Method

#### 第三层：字段明细表

统一使用如下表结构：

| 本系统字段名 | AFP接口字段名 | 修改前值 | 修改后值 |
| --- | --- | --- | --- |

### 14.2 明细表展示规则

- 仅展示当前对象组下的字段；
- 若字段本次无变化，允许修改前值与修改后值相同；
- 若字段本次新增填写，修改前值为空；
- 若字段本次删除清空，修改后值为空；
- 若字段属于返回结果字段，则可在“修改前值 / 修改后值”位置展示当次状态差异。

---

## 15. 本文档对后续文档修改的约束作用

后续修改 **商戶進件功能說明-进件单列表页.md** 时，凡涉及以下内容，均必须以本文档为准：

- 修改信息重新进件弹窗字段范围
- 进件历史记录弹窗字段范围
- 各对象分组方式
- 字段名称
- AFP 接口字段路径
- 历史记录中的“修改前 / 修改后”显示方式
- Payment Method 不展示费率的规则

若后续要新增 AFP 字段，必须先更新本文档，再同步更新页面功能说明，不允许直接跳过本文档在页面文档中临时新增。

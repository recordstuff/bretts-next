import { AttributeDataType } from './AttributeDataType'

export interface AttributeDefinitionDetail {
    Guid: string
    Name: string
    DataType: AttributeDataType
}

export const emptyAttributeDefinitionDetail = (): AttributeDefinitionDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Name: '',
    DataType: AttributeDataType.String,
})

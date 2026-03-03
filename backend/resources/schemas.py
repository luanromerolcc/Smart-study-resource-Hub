from pydantic import BaseModel, field_validator

class smartAssistRequest(BaseModel):
    title: str
    type: str

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls,v):
        if not v:
            raise ValueError('title is required')
        return v
            
    @field_validator('type')
    @classmethod
    def type_must_be_valid(cls,v):#only happens in case of direct api call
        if v not in ['pdf','video','link']:
            raise ValueError('type must be pdf, video or link')
        return v
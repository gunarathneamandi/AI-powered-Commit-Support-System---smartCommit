from fastapi import HTTPException, APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from backend.src.config import db  

router = APIRouter()

# Pydantic model for the request body
class UserDeleteRequest(BaseModel):
    project_name: str
    user: str

@router.delete("/delete_user")
async def delete_user(data: UserDeleteRequest):
    try:
        # Attempt to update the project by pulling (removing) the user
        result = await db.projects.update_one(
            {"project_name": data.project_name},
            {"$pull": {"users": data.user}}
        )

        if result.matched_count == 0:
            return JSONResponse(content={"message": "Project not found."}, status_code=404)
        
        
        if result.modified_count == 0:
            return JSONResponse(content={"message": "Rule not found in the project."}, status_code=400)
        
        
        return JSONResponse(content={"message": "Rule deleted successfully."}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

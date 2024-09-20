"""main.py: FastAPI application entry point.

"""

from fastapi import FastAPI, Depends, HTTPException  # pylint: disable=E0401
from fastapi.middleware.cors import CORSMiddleware  # pylint: disable=E0401
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import engine, get_db
from fastapi import APIRouter, Depends, Query
from typing import List, Optional


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/logs/", response_model=schemas.Log)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    return crud.create_log(db=db, log=log)


@app.post("/populate_logs/")
def populate_log(db: Session = Depends(get_db)):
    crud.populate_log(db=db)
    return {"message": "Logs populated"}


@app.get("/logs/", response_model=List[schemas.Log])
def read_logs(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(6, ge=1, le=1000, description="Number of logs per page"),
    filt: Optional[List[str]] = Query(
        None, description="Fields to filter by (severity, date, source)"
    ),
    sort: str = Query(
        "date", regex="^(date|source|severity)$", description="Field to sort by"
    ),
    search: Optional[str] = Query(None, description="Search term"),
):
    logs = crud.get_logs(
        db, page=page, limit=limit, filter_params=filt, sort=sort, search=search
    )
    return logs


@app.get("/logs/{log_id}", response_model=schemas.Log)
def read_log(log_id: int, db: Session = Depends(get_db)):
    db_log = crud.get_log(db, log_id=log_id)
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return db_log


@app.put("/logs/{log_id}", response_model=schemas.Log)
def update_log(log_id: int, log: schemas.LogCreate, db: Session = Depends(get_db)):
    db_log = crud.update_log(db, log_id=log_id, log=log)
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return db_log


@app.delete("/logs/{log_id}", response_model=schemas.Log)
def delete_log(log_id: int, db: Session = Depends(get_db)):
    db_log = crud.delete_log(db, log_id=log_id)
    if db_log is None:

        raise HTTPException(
            status_code=404,
            detail="Log not found, use `force=True` to delete all logs, this is irreversible.",
        )
    return db_log


@app.delete("/logs/")
def empty_log(db: Session = Depends(get_db), force: bool = False):
    if force:
        # I am aware this is something dangerous, I did it just for the sake of the exercise
        crud.empty_logs(db)
    else:
        raise HTTPException(
            status_code=404,
            detail="Use `force=True` to delete all logs, this is irreversible.",
        )
    return {"message": "All logs deleted"}


@app.post("/logs/query", response_model=list[schemas.Log])
def query_logs(query: schemas.LogQuery, db: Session = Depends(get_db)):
    return crud.query_logs(db, query)


@app.post("/logs/aggregate")
def aggregate_logs(query: schemas.LogQueryAggregate, db: Session = Depends(get_db)):
    return crud.aggregate_logs(db, query)

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addProcedureToPlan,
  // getPlanProcedures,
  getProcedures,
  getUsers,
  addUsersToProcedure,
  getUserProcedure,
} from "../../api/api";
import Layout from '../Layout/Layout';
import ProcedureItem from "./ProcedureItem/ProcedureItem";
import PlanProcedureItem from "./PlanProcedureItem/PlanProcedureItem";

const Plan = () => {
  let { id } = useParams();
  const [procedures, setProcedures] = useState([]);
  const [planProcedures, setPlanProcedures] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [users, setUsers] = useState([]);
  const [disableAssgin, setDisableAssgin] = useState(false);

  useEffect(() => {
    (async () => {
      var procedures = await getProcedures();
      // var planProcedures = await getPlanProcedures(id);
      var users = await getUsers();
      var userProcedure = await getUserProcedure(id);

      const groupedData = userProcedure?.reduce((acc, item) => {
        const key = item.procedureId;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});
      const tablePlanProcedure = [];
      const selectedTableUsers = {};
      
      var userOptions = [];
      users.map((u) => userOptions.push({ label: u.name, value: u.userId }));

      const groupedArray = Object?.keys(groupedData) ?? [];
      groupedArray?.forEach(id => {
        const procedure = procedures?.find(pro => pro.procedureId.toString() === id) ?? {};

        tablePlanProcedure.push({
            planId: id,
            procedureId: procedure.procedureId,
            procedure: {
              procedureId: procedure.procedureId,
              procedureTitle: procedure.procedureTitle,
            },
          });
          const groupedUserData = groupedData?.[id] ?? [];
          const userList = [];
          groupedUserData?.forEach(userData => {
            const user = userOptions?.find(x => x.value === userData.userId) ?? null;

            if(user) {
              userList.push(user);
            }
          });
          selectedTableUsers[id] = userList;
      });
      setPlanProcedures([...tablePlanProcedure]);
      setUsers(userOptions);
      setProcedures(procedures);
      setSelectedUsers(selectedTableUsers);
      // setPlanProcedures(planProcedures);
    })();
  }, [id]);

  const handleAddProcedureToPlan = async (procedure) => {
    const hasProcedureInPlan = planProcedures.some((p) => p.procedureId === procedure.procedureId);
    if (hasProcedureInPlan) return;

    await addProcedureToPlan(id, procedure.procedureId);
    setPlanProcedures((prevState) => {
      return [
        ...prevState,
        {
          planId: id,
          procedureId: procedure.procedureId,
          procedure: {
            procedureId: procedure.procedureId,
            procedureTitle: procedure.procedureTitle,
          },
        },
      ];
    });
  };

  const assignUserToProcedure = async () => {
    setDisableAssgin(true);
    const procedures = [];
    const inputJson = selectedUsers ?? {};
    for (const procedureId in inputJson) {
      if (inputJson.hasOwnProperty(procedureId)) {
          const users = inputJson[procedureId];
          const userIds = users.map(user => user.value);
  
          procedures.push({
              userIds: userIds,
              procedureId: parseInt(procedureId)
          });
      }
    }
    await addUsersToProcedure(procedures, id);
    setDisableAssgin(false);
  };

  const assignUsers = (key, users) => {
    setSelectedUsers(prev => {
      if(!prev?.[key]) {
        prev[key] = [];
      }
      prev[key] = users;
      return {...prev};
    });
  };

  return (
    <Layout>
      <div className="container pt-4">
        <div className="d-flex justify-content-center">
          <h2>OEC Interview Frontend</h2>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="card shadow">
              <h5 className="card-header">Repair Plan</h5>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h4>Procedures</h4>
                    <div>
                      {procedures.map((p) => (
                        <ProcedureItem
                          key={p.procedureId}
                          procedure={p}
                          handleAddProcedureToPlan={handleAddProcedureToPlan}
                          planProcedures={planProcedures}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col">
                    <h4>Added to Plan</h4>
                    <div>
                      {planProcedures.map((p) => (
                        <PlanProcedureItem
                          key={p.procedure.procedureId}
                          procedureId={p.procedure.procedureId}
                          procedure={p.procedure}
                          users={users}
                          selectedUsers={selectedUsers}
                          assignUsers={assignUsers}
                        />
                      ))}
                      {planProcedures?.length > 0 ?<button className="btn btn-primary" disabled={disableAssgin} onClick={() =>assignUserToProcedure()}>
                        Assign Users
                      </button> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plan;

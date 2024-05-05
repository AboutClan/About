/* eslint-disable */

import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import { useStudyPlacesQuery } from "../../../hooks/study/queries";
import { ISpaceControl } from "../../../types/models/admin";

function Adminstudy() {
  const { data } = useStudyPlacesQuery("all");
  const { register, handleSubmit } = useForm({});

  const [addRequestForm, setAddRequestForm] = useState({
    branch: "",
    latitude: "",
    longitude: "",
    brand: "",
    location: "",
    status: "",
    image: "",
  });

  const onAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddRequestForm({ ...addRequestForm, [name]: value });
  };
  const onAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const [btnIdx, setBtnIdx] = useState<number>();

  const onValid = (data: ISpaceControl) => {
    // const spaceData: ISpaceControl = {
    //   branch: data?.branch[btnIdx],
    //   brand: data?.brand[btnIdx],
    //   latitude: data?.latitude[btnIdx],
    //   longitude: data?.longitude[btnIdx],
    //   location: data?.location[btnIdx] as Location,
    //   status: data?.status[btnIdx],
    //   image: data?.image[btnIdx],
    // };
  };

  return (
    <>
      <Header title="스터디 장소 정보" url="/admin" />

      <Layout>
        <SpaceAddRequest>
          <AddForm onSubmit={onAddSubmit}>
            <span>장소 추가</span>
            <div>
              <span>branch:</span>
              <input
                type="text"
                name="branch"
                value={addRequestForm.branch}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>latitude:</span>
              <input
                type="text"
                name="latitude"
                value={addRequestForm.latitude}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>longitude:</span>
              <input
                type="text"
                name="longitude"
                value={addRequestForm.longitude}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>brand:</span>
              <input
                type="text"
                name="brand"
                value={addRequestForm.brand}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>location:</span>
              <input
                type="text"
                name="location"
                value={addRequestForm.location}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>status:</span>
              <input
                type="text"
                name="status"
                value={addRequestForm.status}
                onChange={onAddInputChange}
              />
            </div>
            <div>
              <span>image:</span>
              <input
                type="text"
                name="image"
                value={addRequestForm.image}
                onChange={onAddInputChange}
              />
            </div>
            <Button
              type="submit"
              style={{
                marginTop: "4px",
                backgroundColor: "var(--color-red)",
                color: "white",
                width: "60px",
                height: "28px",
              }}
            >
              추가
            </Button>
          </AddForm>
        </SpaceAddRequest>
        {data?.map((place, idx) => (
          <Form key={idx} id={`place${idx}`} data-idx={idx} onSubmit={handleSubmit(onValid)}>
            <div>
              <ImageContainer>
                {/* <studyLogo place={place} isBig={false} /> */}
                temp
              </ImageContainer>
              <SpaceInfo>
                <Status>
                  <Branch defaultValue={place?.branch} {...register(`branch[${idx}]`)} />

                  <input defaultValue={place?.latitude} {...register(`latitude[${idx}]`)} />

                  <input defaultValue={place?.longitude} {...register(`longitude[${idx}]`)} />
                </Status>
                <Status>
                  <Info defaultValue={place?.brand} {...register(`brand[${idx}]`)} />
                  <input defaultValue={place?.location} {...register(`location[${idx}]`)} />
                  <input defaultValue={place?.status} {...register(`status[${idx}]`)} />
                </Status>
              </SpaceInfo>
            </div>
            <input defaultValue={place?.image} {...register(`image[${idx}]`)} />
            <button
              form={`place${idx}`}
              style={{
                background: "var(--color-red)",
                width: "60px",
                alignSelf: "center",
                marginTop: "10px",
                color: "white",
                borderRadius: "9px",
              }}
              type="submit"
              onClick={() => setBtnIdx(idx)}
            >
              변경
            </button>
          </Form>
        ))}
      </Layout>
    </>
  );
}

const Layout = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
`;

const SpaceAddRequest = styled.div``;

const Form = styled.form`
  height: 150px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 12px;
  > div {
    display: flex;
  }
`;

const AddForm = styled.form`
  height: 280px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 12px;
  > span {
    font-weight: 600;
    font-size: 16px;
  }
  > div {
    margin-top: 6px;
    margin-bottom: 2px;
    > span {
      display: inline-block;
      width: 80px;
    }
    input {
      background-color: var(--gray-7);
    }
  }
`;

const ImageContainer = styled.div`
  width: 77px;
  height: 77px;
  border: 1px solid var(--gray-5);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const SpaceInfo = styled.div`
  color: var(--gray-2);
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  > input {
    width: 80px;
  }
`;

const Branch = styled.input`
  font-weight: 800;
  font-size: 16px;
  color: var(--gray-1);
`;

const Info = styled.input`
  color: var(--gray-3);
  font-size: 12px;
`;

export default Adminstudy;

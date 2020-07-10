import React, { useMemo, useState, useEffect } from "react";
import { Container, FormInput } from "shards-react";
import { useGet } from "restful-react";
import Title from "../../components/Title";
import Select from "react-select";
import Stats from "../../components/Stats";
import Loading from "../../components/Loading";
import { format, set } from "date-fns";
import countryOptions from "../../countries-pt.json";

import './Dashboard.scss';

const Dashboard = () => {
  const { data, loading } = useGet({
    path: "https://api.covid19api.com/summary"
  });

  const [country, setCountry] = useState({ value: "BR", label: "Brasil", slug: 'brazil' });
  const [dataByContry, setDataByContry] = useState();

  const currentDay = format(set(new Date(), { day: -2 }), "yyyy-MM-dd")

  const [startDate, setStartDate] = useState(currentDay);
  const [endDate, setEndDate] = useState(currentDay);

  const query = useMemo(() => {
    return `from=${startDate}T00:00:00Z&to=${endDate}T23:59:59Z`
  }, [startDate, endDate]);

  const { data: countryData, loading: countryLoading, refetch } = useGet({
    path: `https://api.covid19api.com/country/${country.slug}?${query}`
  });

  useEffect(() => {
    refetch();
  }, [query])

  useEffect(() => {
    if (data) {
      setDataByContry(data.Countries.find((item) => item.CountryCode === country.value));
    };
  }, [data]);

  const changeCountry = newCountry => {
    setCountry(newCountry);
    setDataByContry(data.Countries.find((item) => item.CountryCode === newCountry.value))
  };

  const changeStartDate = ({ value }) => {
    setStartDate(value)
  };

  const changeEndDate = ({ value }) => {
    setEndDate(value)
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : data ? (
        <>
          <Title title={"Global Data"} />
          <Stats
            confirmed={data.Global.TotalConfirmed}
            recovered={data.Global.TotalRecovered}
            deaths={data.Global.TotalDeaths}
          />
          <Title title={"Data by country"} />
          <div className="data-country">

            <Select
              value={country}
              isSearchable={true}
              options={countryOptions}
              onChange={changeCountry}
            />
            <div className="dates">
              <input type='date' value={startDate} onChange={({ target }) => changeStartDate(target)} />
              <input type='date' value={endDate} onChange={({ target }) => changeEndDate(target)} />
            </div>
          </div>

          {!dataByContry ? (
            <Loading />
          ) : (
              <Stats
                confirmed={dataByContry.TotalConfirmed}
                recovered={dataByContry.TotalRecovered}
                deaths={dataByContry.TotalDeaths}
              />
            )}

          <h4 className="per-day">Por dia:</h4>

          {countryLoading ? (
            <Loading />
          ) : countryData ? (
              countryData.map((item) => (
                <div>
                  <p>{format(set(new Date(item.Date), { day: -1 }), "yyyy-MM-dd")}</p>
                  <Stats
                    confirmed={item.Confirmed}
                    recovered={item.Recovered}
                    deaths={item.Deaths}
                  />
                </div>
              ))
            )
            : <p>Error trying to load daily data.</p>
          }
        </>
      )
        : <div className='error-message'><p>Error trying to load data. Try again in a few minutes</p></div>
      }
    </Container>
  );
};

export default Dashboard;

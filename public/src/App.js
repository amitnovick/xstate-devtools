import './App.css';
import { App as XStateViz } from '@statecharts/xstate-viz';
import React from 'react';

const App = ({ services }) => {
  const [selectedServiceId, setSelectedServiceId] = React.useState(
    services[services.length - 1].serviceId
  );

  const selectedService = services.find(
    service => service.serviceId === selectedServiceId
  );

  return (
    <>
      <label htmlFor="services-select">Choose a service: </label>
      <select
        name="services"
        id="services-select"
        value={selectedServiceId}
        onChange={({ target }) => setSelectedServiceId(Number(target.value))}
      >
        {services.map(service => {
          if (service.hasStopped && service.serviceId !== selectedServiceId) {
            return null;
          } else {
            return (
              <option key={service.serviceId} value={service.serviceId}>
                {service.hasStopped ? 'Stopped: ' : ''}
                {`${service.serviceId} - ${service.machine.id}`}
              </option>
            );
          }
        })}
      </select>
      {services.length > 0 ? (
        selectedService.hasStopped ? (
          <h2>The selected service has been stopped.</h2>
        ) : (
          <XStateViz
            machine={selectedService.machine}
            state={selectedService.state}
          />
        )
      ) : (
        <h2>No services to display</h2>
      )}
    </>
  );
};

export default App;

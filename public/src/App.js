import './App.css';
import { App as XStateViz } from '@statecharts/xstate-viz';
import React from 'react';
import Dropdown from './Dropdown';

const formatLabel = service => `${service.serviceId} - ${service.machine.id}`;

const App = ({ services }) => {
  const [selectedServiceId, setSelectedServiceId] = React.useState(
    services[services.length - 1].serviceId
  );

  const selectedService = services.find(
    service => service.serviceId === selectedServiceId
  );

  return (
    <>
      <Dropdown
        selectedItem={{
          value: selectedServiceId,
          label: `${selectedService.hasStopped ? 'Stopped: ' : ''}${formatLabel(
            selectedService
          )}`
        }}
        setSelectedItem={serviceId => setSelectedServiceId(serviceId)}
        items={services
          .filter(
            service =>
              (service.hasStopped &&
                service.serviceId !== selectedServiceId) === false
          )
          .map(service => ({
            label: formatLabel(service),
            value: service.serviceId
          }))}
      />
      {services.length > 0 ? (
        selectedService.hasStopped ? (
          <h2>The selected service has been stopped.</h2>
        ) : (
          <XStateViz
            machine={selectedService.machine}
            state={selectedService.state}
            serviceSummary={formatLabel(selectedService)}
          />
        )
      ) : (
        <h2>No services to display</h2>
      )}
    </>
  );
};

export default App;

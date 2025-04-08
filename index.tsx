import React from 'react';
import ReactDOM from 'react-dom/client';

interface Param {
  id: number;
  name: string;
  type: 'string'; // add some other new types of data
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  values: { [paramId: number]: string };
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const initialValues: { [paramId: number]: string } = {};
    props.params.forEach((param) => {
      const existingValue = props.model.paramValues.find(
        (pv) => pv.paramId === param.id
      );
      initialValues[param.id] = existingValue ? existingValue.value : '';
    });

    this.state = {
      values: initialValues
    };
  }

  handleChange = (paramId: number, value: string) =>
    this.setState((prevState) => ({
      values: {
        ...prevState.values,
        [paramId]: value
      }
    }));

  public getModel(): Model {
    const paramValues: ParamValue[] = Object.entries(this.state.values).map(
      ([paramId, value]) => ({
        paramId: Number(paramId),
        value
      })
    );

    return {
      paramValues,
      colors: this.props.model.colors
    };
  }

  //add types to Param and create here new case with this type to scale the app
  renderInput(param: Param) {
    switch (param.type) {
      case 'string':
      default:
        return (
          <>
            <input
              type='text'
              value={this.state.values[param.id] || ''}
              onChange={(e) => this.handleChange(param.id, e.target.value)}
            />
          </>
        );
    }
  }

  render() {
    return (
      <>
        {this.props.params.map((param) => (
          <div key={param.id} style={{ marginBottom: '10px' }}>
            <label>
              {param.name}: {this.renderInput(param)}
            </label>
          </div>
        ))}
      </>
    );
  }
}

const mockParams: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' }
];

const mockModel = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' }
  ],
  colors: []
};

const editorRef = React.createRef<ParamEditor>();

const App = () => (
  <>
    <h1>Редактирование модели</h1>
    <ParamEditor ref={editorRef} params={mockParams} model={mockModel} />
    <button
      onClick={() =>
        console.log('Текущая модель:', editorRef.current?.getModel())
      }
    >
      Получить модель
    </button>
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

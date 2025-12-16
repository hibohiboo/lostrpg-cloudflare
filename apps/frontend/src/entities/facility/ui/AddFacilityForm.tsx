import { equipmentList } from '@lostrpg/core/game-data/lostrpg';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Facility } from '../model/types';

type Props = {
  equipmentSelect: string;
  onEquipmentAdd: (item: Facility) => void;
};

export const AddFacilityForm: React.FC<Props> = ({
  equipmentSelect,
  onEquipmentAdd,
}) => {
  // 設備追加ハンドラー
  const handleEquipmentAdd = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const item = equipmentList.find((i) => i.name === value);
    if (item) {
      const newFacility: Facility = {
        id: `facility-${Date.now()}`,
        name: item.name,
        type: item.type,
        specialty: item.specialty,
        level: 1,
        effect: item.effect,
      };
      onEquipmentAdd(newFacility);
    }
  };
  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>設備追加</InputLabel>
      <Select
        value={equipmentSelect}
        label="設備追加"
        onChange={handleEquipmentAdd}
      >
        <MenuItem value="">未選択</MenuItem>
        {equipmentList.map((item) => (
          <MenuItem value={item.name} key={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

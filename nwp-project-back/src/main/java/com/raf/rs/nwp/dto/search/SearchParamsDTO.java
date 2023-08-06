package com.raf.rs.nwp.dto.search;

import com.raf.rs.nwp.model.enums.MachineStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SearchParamsDTO {
    private String name;
    private List<MachineStatus> statuses;
    private OffsetDateTime dateFrom;
    private OffsetDateTime dateTo;
    private int page = 0;
    private int size = 10;
}
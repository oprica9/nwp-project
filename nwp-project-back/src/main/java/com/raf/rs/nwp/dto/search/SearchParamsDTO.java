package com.raf.rs.nwp.dto.search;

import com.raf.rs.nwp.model.enums.MachineStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SearchParamsDTO {
    private String name;
    private List<MachineStatus> statuses;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private int page = 0;
    private int size = 10;
    // getters and setters
}
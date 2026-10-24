package com.makemymarriage.tenancy;

import com.makemymarriage.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TenancyController {

    private final MarriageRepository marriageRepository;

    public TenancyController(MarriageRepository marriageRepository) {
        this.marriageRepository = marriageRepository;
    }

    @GetMapping("/tenancy")
    public ApiResponse<String> tenancy() {
        long count = marriageRepository.count();
        return ApiResponse.success("Tenant root available. Marriages registered: " + count);
    }
}

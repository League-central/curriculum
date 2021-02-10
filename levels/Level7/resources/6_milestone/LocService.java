package org.jointheleague.api.cheetah.Cheetah_Search.service;

import org.jointheleague.api.cheetah.Cheetah_Search.repository.LocRepository;
import org.springframework.stereotype.Service;

@Service
public class LocService {

    private final LocRepository locRepository;

    public LocService(LocRepository locRepository) {
        this.locRepository = locRepository;
    }

    public String getResults(String query){
        return locRepository.getResults(query);
    }

}
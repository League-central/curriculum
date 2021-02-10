package org.jointheleague.api.cheetah.Cheetah_Search.service;

import org.springframework.stereotype.Service;

@Service
public class LocService {

    public String getResults(String query){
        return "Searching for books related to " + query;
    }

}
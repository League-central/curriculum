package org.jointheleague.api.cheetah.Cheetah_Search.presentation;

import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.Result;
import org.jointheleague.api.cheetah.Cheetah_Search.service.LocService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(LocController.class)
class LocControllerIntTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LocService locService;

    @Test
    public void givenGoodQuery_whenSearchForResults_thenIsOkAndReturnsResults() throws Exception {
        //given
        String query = "Java";
        String title = "Java: A Drink, an Island, and a Programming Language";
        String author = "AUTHOR";
        String link = "LINK";
        Result result = new Result();
        result.setTitle(title);
        result.setAuthors(Collections.singletonList(author));
        result.setLink(link);
        List<Result> expectedResults = Collections.singletonList(result);

        when(locService.getResults(query)).thenReturn(expectedResults);

        //when
        //then
        MvcResult mvcResult = mockMvc.perform(get("/searchLocResults?q=" + query))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is(title)))
                .andExpect(jsonPath("$[0].authors[0]", is(author)))
                .andExpect(jsonPath("$[0].link", is(link)))
                .andReturn();

        assertEquals(MediaType.APPLICATION_JSON_VALUE, mvcResult.getResponse().getContentType());
    }

    @Test
    public void givenBadQuery_whenSearchForResults_thenIsNotFound() throws Exception {
        //given
        String query = "Java";

        //when
        //then
        mockMvc.perform(get("/searchLocResults?q=" + query))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}

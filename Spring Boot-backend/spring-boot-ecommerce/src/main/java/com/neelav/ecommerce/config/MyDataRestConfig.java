package com.neelav.ecommerce.config;

import javax.persistence.metamodel.EntityType;
import com.neelav.ecommerce.dao.ProductRepository;
import com.neelav.ecommerce.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    //Constructor Injection
    @Autowired
    public MyDataRestConfig(EntityManager entityManager)
    {
        this.entityManager=entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        HttpMethod[] theUnsuportedActions= {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metadata,httpMethods) -> httpMethods.disable(theUnsuportedActions))
                .withCollectionExposure((metadata,httpMethods) -> httpMethods.disable(theUnsuportedActions));

        config.getExposureConfiguration()
                .forDomainType(ProductRepository.class)
                .withItemExposure((metadata,httpMethods) -> httpMethods.disable(theUnsuportedActions))
                .withCollectionExposure((metadata,httpMethods) -> httpMethods.disable(theUnsuportedActions));


        //get the Product and Product CategoryIds
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config)
    {

        //expose entity ids

        //GET a list of all entities from the entity manager

        Set<EntityType<?>> entities =  entityManager.getMetamodel().getEntities();


        //create an ArrayList of the EntityTypes
        List<Class> entityList = new ArrayList<>();

        for(EntityType tempEntityType: entities)
        {
            //Get the Type of Entities in the Project
            //E.g: Product and Product Category
            entityList.add(tempEntityType.getJavaType());
        }

        //Expose the Id for Domain Types
        Class[] domainTypes= entityList.toArray(new Class[0]);



        config.exposeIdsFor(domainTypes);


    }
}

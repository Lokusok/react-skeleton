import mc from 'merge-change';
import listToTree from '@src/utils/list-to-tree';
import StoreModule from '@src/services/store/module';

class CategoriesState extends StoreModule<undefined> {

  initState() {
    return {
      items: [],
      roots: [],
      wait: false,
      errors: null,
    };
  }

  /**
   * Загрузка списка из апи
   * @param params Параметры запроса
   * @returns {Promise<*>}
   */
  async load(params: any) {
    this.updateState({ wait: true, errors: null, x: 100 }, 'Статус ожидания');
    try {
      const response = await this.services.api.endpoints.categories.findMany(params);
      const result = response.data.result;
      this.updateState(
        mc.patch(result, { roots: listToTree(result.items), wait: false, errors: null }),
        'Категории загружены',
      );
      return result;
    } catch (e: any) {
      if (e.response?.data?.error?.data) {
        this.updateState(
          { wait: false, errors: e.response.data.error.data.issues },
          'Ошибка от сервера',
        );
      } else {
        throw e;
      }
    }
  }
}

export default CategoriesState;
